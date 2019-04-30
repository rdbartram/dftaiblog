---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 8 Script Based Resource Part 1'
description: Today is simply discussing the structure of a DSC Resource. How it works, setting it up, and some things to start thinking about before we start coding.
excerpt: Today is simply discussing the structure of a DSC Resource. How it works, setting it up, and some things to start thinking about before we start coding.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - resource
readtime: 8 min
created_at: 2018-02-08 08:00
updated_at: 2018-02-08 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 8 is here and today is the day we start creating our own custom script based resources. Since it is quite a large topic I am going to split it up in to multiple parts.

Today is simply discussing the structure of a DSC Resource. How it works, setting it up, and some things to start thinking about before we start coding.

## The Concept

In the first post I briefly mentioned that DSC first tests a machines configuration and then in the event it is not compliant, DSC makes it so.

What I didn't tell you was that DSC actually has the ability to not only test a system but also "get" or display the current configuration of a machine.

These 3 functions of DSC (Getting, Testing and Setting) are reflected in the 3 mandatory functions required for you script based DSC Resource.

A bare bones DSC Resource looks like this.

```powershell
Get-TargetResource {

}

Test-TargetResource {

}

Set-TargetResource {

}
```

Now all <strong>you</strong> as the Resource developer has to do, is fill out these empty blocks.

## Scaffolding

Fortunately, to get you started, Microsoft has provided a PowerShell module, [xDSCResourceDesigner](https://github.com/PowerShell/xDSCResourceDesigner) I would recommend using this rather than trying to create the resources from scratch, you are far less failure prone.

What this module includes is a couple of cmdlets to help you create, update and test your DSC Resources.

As of today it only supports script based resources. However, once you're all DSC Experts, maybe you can help to extend the module with Pull Requests of your own (More to come later in the series about how to contribute to GitHub projects).

To create a resource, you can use the following example

```powershell
$UserName = New-xDscResourceProperty -Name UserName -Type String -Attribute Key
$Password = New-xDscResourceProperty -Name Password -Type PSCredential -Attribute Write
$DomainCredential = New-xDscResourceProperty -Name DomainAdministratorCredential -Type PSCredential -Attribute Write
$Ensure = New-xDscResourceProperty -Name Ensure -Type String -Attribute Write -ValidateSet "Present", "Absent"
#Now create the resource
New-xDscResource -Name dftaiADUser -Property $UserName, $Password, $DomainCredential, $Ensure  -Path 'C:\Program Files\WindowsPowerShell\Modules\dftaiActiveDirectory'
```

As you can see, it created the entire folder structure for me, including the contents.

![AD DSC folder](./images/dftaiactivedirectorydscfolder.png)

The detectives among you may have noticed and are curious as to the contents of the dftaiADUser.schema.mof and what it is. Yesterday when we created the composite resource, all our code existed in the dftaisqlsetup.schema.psm1. So whats the deal?

It comes back to the definition of the resource. In the case of the composite resource, DSC was looking at the parameters of the configuration block and presenting these as the parameters for the resource.

In the case of a script based resource, the schema.mof is the definition of the resource. It is slightly more powerful than that of the composite resource, if not more complicated, as it defines one of more classes (More on custom MOF classes in another post).

```powershell
[ClassVersion("1.0.0.0"), FriendlyName("dftaiADUser")]
class dftaiADUser : OMI_BaseResource
{
    [Key] String UserName;
    [Write, EmbeddedInstance("MSFT_Credential")] String Password;
    [Write, EmbeddedInstance("MSFT_Credential")] String DomainAdministratorCredential;
    [Write, ValueMap{"Present","Absent"}, Values{"Present","Absent"}] String Ensure;
};
```

Here you can see that the username field is marked as Key which means it is what is used to identify the instances of the resource and make them unique.

If I tried to create 2 users called Ryan with this resource it would fail because there already exists a user with username Ryan.

However, if I set the Ensure property as Key also, then I could define Ryan twice. Once as present and once as absent. I could use this if a temporary account it needed for the lifetime of the configuration.

All other properties in this are just write i.e. optional. The other options available are Required and Read, should you need them.

Ok, so as of right now, we have created a custom DSC Resource that we can call in our configuration as in the example below. However, it doesn't really do a lot...in fact is does nothing. Tomorrow we will pick up where we left off here and start filling out DSC Resource so it is actually useful to us.

```powershell
Configuration ADUser
{
    Import-DSCResource -ModuleName dftaiActiveDirectory

    Node DC01 {
        dftaiADUser Ryan {
            UserName = 'Ryan'
            Password = New-Object PSCredential -ArgumentList 'DFTAI\Ryan', (ConvertTo-SecureString 'Password' -AsPlainText -Force)
            DomainAdministratorCredential = New-Object PSCredential -ArgumentList 'DFTAI\Administrator', (ConvertTo-SecureString 'Password' -AsPlainText -Force)
            Ensure = 'Present'
        }
    }
}
```

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
