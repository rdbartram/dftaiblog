---
view: post
layout: post
lang: en
author: rdbartram
title: Automating DSC Partial Configuration Name Updates
description: Updating partial configuration names on the pull server are not automatically reflected in LCM...until now.
excerpt: Updating partial configuration names on the pull server are not automatically reflected in LCM...until now.
cover: false
categories:
  - dsc
tags:
  - powershell
  - lcm
  - partial configuration
created_at: 2017-07-04 19:00
updated_at: 2017-07-04 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

Hey guys, as a follow up to my previous post [Updating DSC ConfigurationNames from the Pull Server](http://www.dftai.ch/trending/updating-dsc-confignames-pull-server/), I've started working on a module to automate the configuration of the LCM.

Right now it isn't possible to set the LCM by means of a pull.

This is unfortunate since if you wanted to do something such as update the partial configuration names defined on your pull server, the LCM by default is never going to pull the changes.

Here's where two of functions in my new module come in.

If partial configurations are defined on the pull server but not in the LCM, upon the next refresh the following error occurs.

![Missing Partial Configuration](./images/MissingPartialConfiguration.png)

To avoid this simply using the following two commands to first parse the missing partial configurations and second add them to the LCM.

The functions themselves can be found in my GitHub [Repo](https://github.com/rdbartram/PS-Tips-Tricks/)

```powershell
try {
    Update-DSCConfiguration -ErrorAction Stop
} catch {
    $_.Exception | Get-DSCMissingPartialConfigName | Set-DSCPartialConfiguration
}
```

All that needs to be done is schedule this to run as often as you like and you have yourself a self configuring LCM.

As of right now, the function directly writes the partial configurations into the metaconfig.mof, however, I intend to rewrite it so it creates a localhost.meta.mof which it turns will be set by the LCM itself.

This is better since I expect Microsoft may encrypt the metaconfig.mof as they have the previous/pending/current.mof files and it is likely that the format may change and my regex parsing will not longer work. For now though it suits my purposes just fine.

Don't Forget to Automate it!
