---
view: post
layout: post
lang: en
author: rdbartram
title: "28 Days of DSC: The Basics"
description: A DSC post for every day in February. Clear, concise, specific DSC posts which will hopefully improve your DSC configurations, resources and troubleshooting no end.
excerpt: A DSC post for every day in February. Clear, concise, specific DSC posts which will hopefully improve your DSC configurations, resources and troubleshooting no end.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
created_at: 2018-02-01 08:00
updated_at: 2018-02-01 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hi Guys,

Sorry for the long absence. However, rather than just apologising to you for not posting, I'm going to make it up to you by attempting to post every day in February. Small, concise and about something I like to think I know very well, DSC. Hopefully this improves your DSC configurations, resources and troubleshooting no end.

## Overview

To begin, I don't want to assume you know what DSC is or how to use it, so I'll give a very brief intro to catch you up. During this month of posts, I'm going to try not to double up on information already provided on [docs.microsoft.com](https://docs.microsoft.com/en-us/powershell/dsc/overview). So if you feel you are missing some information, head over there.

DSC stands for Desired State Configuration and it is something that allows you to declaratively install, setup and otherwise configure Windows, Linux among other devices. DSC starts by testing the system to see if it is in the "desired state" that you want, and if not, DSC makes it so.

Drawing inspiration from the current Spectre/Meltdown debarkle, let's implement the Microsofte fix detailed [here](https://support.microsoft.com/en-us/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to protect against speculative execution side-channel vulnerabilities.

## The Configuration

```powershell
configuration SpectreFix {

    Import-DSCResource -ModuleName PSDesiredStateConfiguration

    node localhost {
        Registry FeatureSettingsOverride {
            Key       = "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management"
            ValueName = "FeatureSettingsOverride"
            ValueData = 0
            ValueType = 'Dword'
            Ensure    = 'Present'
        }

        Registry FeatureSettingsOverrideMask {
            Key       = "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management"
            ValueName = "FeatureSettingsOverrideMask"
            ValueData = 3
            ValueType = 'Dword'
            Ensure    = 'Present'
        }

        Registry MinVmVersionForCpuBasedMitigations {
            Key       = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Virtualization"
            ValueName = "MinVmVersionForCpuBasedMitigations"
            ValueData = "1.0"
            ValueType = 'String'
            Ensure    = 'Present'
        }
    }
}
```

What we've created here is a function "configuration" called SpectreFix, which if called creates the necessary MOF required to set the three registry keys on any server we want.

For those of you familiar with PowerShell this shouldn't be too difficult to read. Every configuration starts out with the Configuration keyword, followed by the name.

Then not strictly necessary but highly recommended is to import all of the modules required for the configuration. If you have multiple versions of a module installed, you will have to specify the -ModuleVersions parameter.

> <lazy-load tag="img" :data="{ src: 'https://i1.wp.com/icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png?w=75', alt: 'warning icon', width:75, style:'float:left; margin: 0 15px 0 0' }" /> Running Get-DSCResource will provide a list of all resources currently installed, as well as the module they are in, the version and parameters list.

The keyword node denotes that a MOF file will be created with the name localhost and to keep it simple this is the server name. But in a later post, we can talk about creating named configurations which can be applied to multiple servers. Think "Security Base Line", "Patch Management", "CONTOSO Domain Controller".

Within the node block is where all the resources definitions are. For our example we are only using the registry resource. However, we could have used the xHotfix resource to install the KB update directly from the Microsoft Catalog.

## Applying

Getting a little ahead of ourselves, there are two ways a device can get a configuration, either PUSH or PULL. For now, we are only talking about PUSH.

Running the following command creates the localhost.mof file in a folder called SpectreFix in the current folder.

```powershell
SpectreFix
```

Running the next command attempts to connect to the device based on the name of the file i.e. localhost and starts the configuration.

```powershell
> Start-DSCConfiguration -Path .\SpectreFix
```

## Confirmation

To confirm everything is working, here are some commands to help you get to grips with the DSC.

You will have noticed that when running the previous command, a PowerShell job was created. To run DSC synchronously, use the following command.

![Start DSC with path](./images/startdscpath-1024x542.png)

To rerun an existing configuration, do the following.

![Start DSC using existing](./images/startdscuse-1024x525.png)

To get the status of the last execution, do the following.

![Get DSC Status](./images/dscstatus-1024x560.png)

Ok, so this wasn't quite as short as I'd expected. Let me guys know what you think about this idea. Has it already been done? Do you need more info?

Make sure to come back because later in the month, I will be showing the new newest DSC resource I've been working on, which is up there with one of coolest.

I look forward to hearing from you either in the comments or on Twitter with the #DFTAI or #28DaysOfDSC

Thanks & Don't Forget To Automate It!
