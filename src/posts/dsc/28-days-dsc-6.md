---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 6 Nested Configurations'
description: Nested Configurations are to DSC what functions are to PowerShell. You can reuse them in your configuration script to save you typing the same thing over and over.
excerpt: Nested Configurations are to DSC what functions are to PowerShell. You can reuse them in your configuration script to save you typing the same thing over and over.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - nested configuration
readtime: 12 min
created_at: 2018-02-06 08:00
updated_at: 2018-02-06 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

So today is Day 6, hope you're all still with me and positive about implementing DSC in your environment. We are building up to something which is on the way to writing our own custom resources. Once you've got the hang of Nested Configurations, you can move onto Composite Resources. Then from there, you can move on to creating script based resources and maybe even class based resources if you're feeling fancy.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

But let's not get ahead of ourselves.

Nested Configurations are to DSC what functions are to PowerShell. You can reuse them in your configuration script to save you typing the same thing over and over.

At the end of the day, you still come out with 1 MOF file per Node, and nobody would know the wiser, unless they looked at your script or your MOF. When you execute them on the Node, they even look like the "more complicated" composite resources.

Again, Microsoft does have a short post on these which you can find [here](https://docs.microsoft.com/en-us/powershell/dsc/compositeconfigs). This post is mainly to remind you that they exist and provide a couple of real life scenarios for them.

Bare in mind I would generally write composite resources to do this job but we'll get to that another day.

## Definition

As you would imagine, the syntax is almost identical to a DSC Configuration. It differs only in one way and that is that is has no node block. It inherits it from the parent script. See below:

```powershell
Configuration NicConfig
{
    param (
        [Parameter()]
        [String] $MacAddress,

        [Parameter(Mandatory)]
        [String] $Name,

        [Parameter(Mandatory)]
        [String] $IPAddress,

        [Parameter(Mandatory)]
        [String] $DefaultGW,

        [Parameter()]
        [String[]] $DNS
    )

    Import-DscResource -ModuleName xNetworking

    if ($MACAddress) {
        xNetAdapterName $Name {
            MacAddress = $MACAddress
            NewName    = $Name
        }
        $NetDeps += "[xNetAdapterName]$Name"
    }

    if ($DNS) {
        xDNSServerAddress $Name {
            Address        = $DNS
            InterfaceAlias = $Name
            AddressFamily  = 'IPv4'
            Validate       = $false
            DependsOn      = $NetDeps
        }
    }

    xIPAddress $IPAddress {
        IPAddress      = $IPAddress
        InterfaceAlias = $Name
        AddressFamily  = 'IPv4'
        DependsOn      = $NetDeps
    }

    if ($DefaultGW) {
        xRoute "dfgw$DefaultGW" {
            InterfaceAlias    = $Name
            AddressFamily     = 'IPv4'
            DestinationPrefix = "0.0.0.0/0"
            NextHop           = $DefaultGW
            Ensure            = "Present"
            Publish           = 'Yes'
            DependsOn         = "[xIPAddress]$($IPAddress)"
        }
    }

}

Configuration MachineConfig
{
    Node localhost
    {
        NicConfig NestedNicConfig {
            Name      = "Ethernet"
            IPAddress = "10.0.0.10/24"
            DefaultGW = "10.0.0.1"
            Dns       = @("10.0.0.2", "10.0.0.3")
        }
    }
}

MachineConfig -outputpath c:\temp
```

All this nested resource does is allow me to easily specify how I want my Nic to look and in the background it goes and calls all the other DSC Resources.

You can simplify the main config so much that perhaps you could train your support staff and juniors to update configurations. All the while knowing you are in control of how the resources are set.

Pretty neat right?!

## Other Examples

Think about all the scripts and functions you've written today and how you could port them over and use the logic to handle DSC Resource configuration. I can imagine using Nested Resources for the following scenarios:

- User deployment - AD, Mailbox, Skype, SharePoint etc
- Nic Configurations
- Disk Configurations
- File Server Folder Structure and NTFS Permissions
- Best Practice/Lockdown policies i.e. stopping services, settings reg keys on IIS Server or SQL etc

This list is virtually endless, the more you automate the less time you have to spend doing tedious tasks. It seems obvious to be telling you this, but sometimes you don't think that spending 5 minutes doing 1 job every now and then costs you a lot. But I imagine if you count up those minutes plus the piece of mind of knowing the system is as you want it (because that's what DSC does) you're really onto a winner!

I hope this has been useful post for you. The level and complexity is going to start to rise as we get into writing our own custom resources, so if this has all been stuff you've already know up until now, then just wait...the good stuff is coming.

The DSC Community is one of sharing, so let me know if you've already written your own Nested or Composite resources. Tweet me with you're ideas about how you would use them in your environments using #28DaysOfDSC.

Thanks!

and Don't Forget To Automate It!
