---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 14 Partial Configurations'
description: The idea behind Partial Configurations is that you can separate the responsibility of each part of you configuration into entirely separate MOFS (Configurations)
excerpt: The idea behind Partial Configurations is that you can separate the responsibility of each part of you configuration into entirely separate MOFS (Configurations)
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - lcm
  - partial configuration
readtime: 13 min
created_at: 2018-02-14 08:00
updated_at: 2018-02-14 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 14! Half way through the series! and yet another new topic.

I mentioned it briefly in yesterday's post regarding DSC Manager, but Partial Configurations are a cool and very useful part of DSC that you need to be aware of.

The idea behind Partial Configurations is that you can separate the responsibility of each part of you configuration into entirely separate MOFS (Configurations).

Today's post, much like the Nested Configurations post is mainly about providing real life examples rather than the this is how you do it. If you need more info or examples you can head over to [docs.microsoft.com](https://docs.microsoft.com/en-us/powershell/dsc/partialconfigs).

The classic example you generally find is there is a Networking Config created by the Network team and a SharePoint Config created by the SharePoint team, perhaps even a SQL Config created by the SQL team.

These normal configurations are written and compiled completely separate from one another, with their own CI/CD pipelines. On the client however, the LCM is configured to pull all those configurations (potentially from different Pull Servers and perhaps a mix of PUSH and PULL) and execute them in a specific order.

## LCM Configuration

Up until now, we as the author of the configurations have been in control of what gets set on the DSC node and in what order. When Partial Configurations come into play, this paradigm reverses itself. It's like a moody teenager, "Don't tell me what to do!". All the logic lies in the LCM and it decides what, when and in which order it runs.

Looking at the meta config, you can see it is requesting an AD Domain Config, a Security Base Line Config, a Networking Config and Service Accounts Config. It is this meta config which decides from where the configs are gathered and the dependencies that they have to one another.

```powershell
[DscLocalConfigurationManager()]
Configuration dftaiDomainControllerConfiguration{
    Settings
    {
        RefreshFrequencyMins            = 30
        RefreshMode                     = "PULL"
        ConfigurationMode               = "ApplyAndMonitor"
        AllowModuleOverwrite            = $true
        RebootNodeIfNeeded              = $true
        ConfigurationModeFrequencyMins  = 60

    }

    ConfigurationRepositoryWeb DSCManager {
        ServerURL                       = 'https://pull.dftai.ch:8080/api/dsc'
        RegistrationKey                 = 5b41f4e6-5e6d-45f5-8102-f2227468ef38
        ConfigurationNames              = @("ADDomainConfig", "SecurityBaseLineConfig", "NetworkingConfig", "ServiceAccounts")
    }

    PartialConfiguration ADDomainConfig {
        Description                     = "Config responsible for deploying AD Domain and fundamental services"
        ConfigurationSource             = @("[ConfigurationRepositoryWeb]DSCManager")
        RefreshMode                     = 'Push'
    }

    PartialConfiguration SecurityBaseLineConfig {
        Description                     = "Config responsible for hardening environment"
        DependsOn                       = '[PartialConfiguration]ADDomainConfig'
        RefreshMode                     = 'Pull'
    }

    PartialConfiguration NetworkingConfig {
        Description                     = "Config responsible for configuring Network stack"
        RefreshMode                     = 'Pull'
    }

    PartialConfiguration ServiceAccounts {
        Description                     = "Config responsible for creating new user accounts"
        DependsOn                       = '[PartialConfiguration]ADDomainConfig'
        RefreshMode                     = 'Pull'
    }
}
```

Explaining a little bit in more detail whats happening here:

- Network Config is pulled from the DSCManager. It is not dependant on anything and runs separate to everything else.
- AD Domain Config would be the next to be <strong>pushed</strong>. The reason it must be pushed is to prevent updates happening onto a domain controller. Someone must explicitly start the config on the domain controller.
- Since the other two configs, ServiceAccounts and SecurityBaseLine are dependant on ADDomainConfig. They will pull the configs from DSCManager and simply wait until the AD Config is successfully deployed.

## Examples and gotchas

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />Partial Configurations will not produce an error if a matching config cannot be found on the pull server

For the example I am about to provide it is useful but in most other cases it can be confusing and lead to the assumption the config is correctly set when it is in fact not.

When onboarding machines (a topic for another post), how can you encrypt the credentials with a certificate that exists only on that machine but of course does not yet exist?

Creating a Partial Configuration from which all others are dependant and within are resources which perform the certificate request and make it available to the author of the configurations.

When the Author sees that the certificate is available then the configuration can be created and the next time the client checks in then it is able to it its other 2, 3 ,4...Partial Configurations.

Other usage examples

- Patch Management
  - Environment specific infos i.e. Domain Join, DNS, Routes
  - Disk Management (Initialize all RAW Disks and assign letter)

As with most things coding, the possibilities are virtually endless. Delegation is key and having configs that don't need to be recompiled every time means less code review and more features/progress!

I hope this has been a useful post for you. If you're currently using Partial Configuration. Tweet me and let me know how you've got it implemented using the hashtag #28DaysOfDSC.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
