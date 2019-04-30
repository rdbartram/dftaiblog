---
view: post
layout: post
lang: en
author: rdbartram
title: Updating DSC ConfigurationNames from the Pull Server
description: Instructions on how to update DSC Client configuration names on the pull server. This enables better control over how and when configurations are set.
excerpt: Instructions on how to update DSC Client configuration names on the pull server. This enables better control over how and when configurations are set.
cover: false
categories:
  - dsc
tags:
  - powershell
  - lcm
  - pullserver
created_at: 2017-06-27 19:00
updated_at: 2017-06-27 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

**UPDATE** 04/07/2017 Code to update LCM automatically based on Configuration Names set on the Pull Server can be found in my blog post [Automating DSC Partial Configuration Name Updates](automating-dsc-partial-configuration-name-updates)

As I'm getting more and more involved in the community, contributing the GitHub projects and forums, I am finding lots of ways to improve the way we use PowerShell/DSC all the time.

Just last friday I was pushed an update to Ben Gelens [DSCPullServerAdmin](https://github.com/bgelens/DSCPullServerAdmin) repo. It enables you to be able to update the ConfigurationNames assigned to a DSC Client and have that client pull that configuration on its next refresh.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'warning icon', width:75, style:'float:left; margin: 0 15px 0 0' }" /> Bare in mind that although this works for both ESENT und SQL based Pull Server DBs, ESENT requires downtime since it only supports single user access. If you were to script the changes, the disruption can be minimised.

## Concept

DSC provides to ways in which clients can retrieve a configuration, by AgentId or by Configuration Name.

The AgentId method is relatively inflexible; you have a single config named the same as the agentid.

What this means is, if you have a configuration that want to to deploy to all agent, say, BGInfo configuration. That same resource configuration would have to exist in each individual mof, going against our DRY principals 😀.

The solution to this is creating a configuration with a name.

What this means it that configurations can be grouped by named and the DSC Client must simply request whichever configurations it wants.

When an DSC Client does request multiple configurations, these are referred to as Partial Configurations.

For more info on Partial Configurations, check out [technet](https://msdn.microsoft.com/en-us/powershell/dsc/partialconfigs) or tweet me.

## Table Schema

Within the Pull Server database there are 3 Tables. The RegistrationData table contains all the agents which are registered to the pull server including which Configuration Names they are assigned to request.

By simply setting the ConfigurationNames column, the DSC Client will retrieve an entirely different configuration.

The format of the column is JSON, using the snippet below converts the array into a JSON array.

I am aware that the cmdlet ConvertTo-Json exists but unless I am missing something, when array are passed with 0 or 1 elements in the array, the cmdlet returns a single property rather than a JSON array. This function simply guarantees an array every time.

```powershell
function ConvertTo-JsonArray {
    [cmdletbinding()]
    param(
        [parameter(Valuefrompipeline)]
        [string[]]
        $InputString
    )
    begin {
        $Output = ""
    }
    process {
        $Output += ('"{0}",' -f $InputString)
    }
    end {
        return "[$($Output.trim(","))]"
    }
}

@("Config1","Config2") | ConvertTo-JsonArray

["Config1","Config2"]
```

When an empty array is set, the client is in AgentId mode. When an array with a single element is set, the client is in ConfigName mode.

As soon as multiple configuration names are defined, the client enters partial configuration mode. What is means is that a partial configuration config must be defined in the LCM for the client to be able to pull the configuration.

When the client is in either one of the other two modes, it simply downloads the client from the registered Pull Server.

## Workarounds

The way to overcome the issue of "Cannot find partial configuration with name: XXX" could be one of the following:

- Have predefined deployment slots. Much like Azure, 3 or 4 predefined deployment slots could be all that you need. WebFarm1_dev, WebFarm1_test, WebFarm1_prod
- Write a script to run regularly and catch this error. When undefined partial config are found, add them dynamically to the LCM

The second point, as of writing this, I haven't tested, but if I do I'll be sure to update this post with a link to my GitHub where the sample will be stored.

## DSCPullServerAdmin

If you want to automate this using the the DSCPullServerAdmin, you can use the following snippet to take the db offline, set the configuration and bring it back online again.

```powershell
iisreset /stop

Mount-DSCPullServerDatabase "C:\\Program Files\\WindowsPowerShell\\DscService\\Devices.edb"

Get-DSCPullServerAdminRegistration -Nodename Server1 | Set-DSCPullServerAdminRegistration -ConfigurationName @("Base","DomainController")

Dismount-DSCPullServerDatabase

iisreset /start
```

I hope this can help some people make the switch to DSC. And for those who are already there, I hope it can make your administration a little simpler.

Over the coming weeks I am going to try to right a lot more about my experience with DSC. I have been using it for a long time now and I don't want you have to experience the same pain I have.

Anything I write to do with that you can find [here](/categories/dsc/).

If you are interested in PowerShell generally and want to learn some tips and tricks to improve your productivity, check out my series [That's What Shell Said](categories/twss/)

If you have any other topics you want me to write about, just comment or tweet me.

And if nothing else

Don't Forget To Automate It!
