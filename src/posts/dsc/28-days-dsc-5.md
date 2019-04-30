---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 5 Securing Your Configurations & Modules'
description: I'm not sure if you've noticed, but if you try to pass credentials to a configuration, DSC will complain during compilation.
excerpt: I'm not sure if you've noticed, but if you try to pass credentials to a configuration, DSC will complain during compilation.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - codesigning
  - encryption
  - lsc
readtime: 9 min
created_at: 2018-02-03 08:00
updated_at: 2018-02-03 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 5! I am writing this whilst watching the SuperBowl, so in the event the Patriots don't win, it may be delayed....foreboding...

Since it is Monday morning when you are reading this, I thought I would post a security topic to get you going for the week.

I'm not sure if you've noticed, but if you try to pass credentials to a configuration, DSC will complain during compilation that you need to secure the credentials or specify the PSDSCAllowPlainTextPassword = \$true.

You won't believe how many times I've seen this get implemented because it isn't clear how to secure the MOF file. Microsoft does have an article [here](https://docs.microsoft.com/en-us/powershell/dsc/securemof) which does try to explain the process. At least for me, I found it difficult to follow and not always correct.

Hopefully, showing you how easy it is to implement will make sure more of your configs are secure!

## Prerequisites
In order to encrypt and sign your configurations you need at the bare minimum (in my opinion) 2 certificates.
<ol>
<li>to encrypt the data, in the best case you would have one per DSC node.</li>
<li>to sign the configurations and modules</li>
</ol>

After testing in my lab, I was able to discern the following requirements for the certificates:

#### Encryption Certificate

* Key Usage
  1. Must contain: 'KeyEncipherment' and 'DataEncipherment'
  2. Should not contain: 'Digital Signature'
* Enhanced Key Usage
  1. Must contain: Document Encryption (1.3.6.1.4.1.311.80.1)
  2. Should not contain: Client Authentication (1.3.6.1.5.5.7.3.2) and Server Authentication (1.3.6.1.5.5.7.3.1
* The Private key should reside on the DSC Node and the public key must be exported as Base64 cert to the build/authoring machine
* The provider can be either Microsoft RSA SChannel Cryptographic Provider or the new Microsoft Software Key Storage Provider. **I've tested both!**

#### Signing Certificate

* Key Usage
  * Must contain: 'Digital Signature'
* Enhanced Key Usage
  * Must contain: Code Signing (1.3.6.1.5.5.7.3.3)
* The Private key should reside on the build/authoring machine and the public key must be imported into every DSC Nodes LocalMachine key store; preferably in a custom store "DSCSignatures" for example
* The provider can be either Microsoft RSA SChannel Cryptographic Provider or the new Microsoft Software Key Storage Provider. **I've tested both!**

## Configuring LCM
So now you have all your certificates ready, we are ready to configure the LCM to check for signatures as well as decrypt configurations.

The LCM configuration is well documented [here](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig), so I won't go into detail about what all the settings do. Just be aware of the SignatureValidation and CertificateID sections.

```powershell
[DSCLocalConfigurationManager()]
Configuration EnableSignatureValidation
{
    Param(
        $ThumbPrint
    )

    Settings
    {
        RefreshMode = 'PUSH'
        CertificateID = $ThumbPrint
    }

    SignatureValidation validations{
        TrustedStorePath = 'Cert:\LocalMachine\DSCSignature'
        SignedItemType = 'Configuration', 'Module'
    }
}
```

The certificateID defines which certificate is used to decrypt certificates, this resides in the LocalMachine\My store.

The SignatureValidation block defines in which store it will looks for trusted signatures and which types of DSC objects will be checked.

## Generating Encrypted Config

To encrypt your configuration you'll need to add just one additional property to your Configuration Data block from [Day 2](28-days-dsc-2). Your ConfigData should look something like this.

```powershell
$ConfigData = @{
    AllNodes = @(
        @{
             Nodename = "DSCNode1"

             CertificateFile = "C:\DSCSignatures\DSCEncryptionCert.cer"
        }
    )
}
```

The CertificateFile property, instructs the configuration to encrypt all sensitive data and writes in the OMI_Configuration the ContentType is "PasswordEncrypted".

If you were using one generic certificate for all your nodes, then you could put the CertificateFile in the Nodename = "\*" block.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />When using partial configurations, make sure if one of your configs is encrypted that all your MOFS are marked with ContentType = "PasswordEncrypted". DSC only checks the first file, and if it isn't encrypted it won't try to decrypt the others.

## Signing Configurations
To sign your configurations you'll need to first get your code signing cert and run the Set-AuthenticodeSignature. The command injects the signature into the bottom of the file and protects against man in the middle config changes.

```powershell
$Cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert
Set-AuthenticodeSignature -Certificate $cert -IncludeChain all -FilePath $MofFile
```

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />**BEWARE!** if you are putting your configs on a pull server, sign the files before creating your checksums

## Signing Modules

To sign modules an additional step is required before the modules are zipped and placed on the pull server.

* Create a FileCatalog of the repo using the New-FileCatalog command
* Sign the file using Set-AuthenticodeSignature

Looks a little Something like this.

```powershell
New-FileCatalog -Path $ModulePath -CatalogFilePath $ModulePath
$Cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert
Set-AuthenticodeSignature -Certificate $cert -IncludeChain all -FilePath "$ModulePath\$ModuleName.cat"
```

At this point, you can zip it like normal and create your checksum.

## The Result
After all the preparation is done, the configs created and signed your Nodes can start pulling and setting the configurations.

If all is well then the jobs runs normally. However, if something isn't right you'll get one of the following errors:

![Unsigned Config](https://docs.microsoft.com/en-us/powershell/wmf/images/pullunsignedconfigfail.png)

or

![Unsigned Catalog](https://docs.microsoft.com/en-us/powershell/wmf/images/pullunisgnedcatalog.png)

Either one basically means that the signatures have been enforced and a valid signature cannot be found for either the configuration or the module.

Phew! Another day another topic down.
Apologies for not getting this post out sooner. The Patroits lost and so I wasn't in the mood to stay up and finish this post. The schedule should be back in place for tomorrow.

Thanks guys and

Don't Forget to Automate it!
