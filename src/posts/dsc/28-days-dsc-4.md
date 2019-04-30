---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 4 Controlling Restarts'
description: Why am I banging on about the LCM and editing it in DSC you might ask...well
excerpt: Why am I banging on about the LCM and editing it in DSC you might ask...well
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - lcm
  - reboot
readtime: 5 min
created_at: 2018-02-04 08:00
updated_at: 2018-02-04 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 4! And since it's a Sunday, I'll make it a short one.

## The Problem

A problem that DSC has and I hope gets addressed in the new Open Source LCM, is that there is no nice way to set the LCM through DSC. You can do it by modifying the metaconfig.mof directly (more about that in another post), but I don't suspect its supported and its not the nicest thing to code in powershell...

Why am I banging on about the LCM and editing it in DSC you might ask...well.

When a DSC Resource requires a restart, it <em>should</em> set the \$Global:DSCMachineStatus variable to 1. In turn, the LCM checks its configuration for the property RebootNodeIfNeeded. If it is true, the device is restarted and based on ActionAfterReboot property, the configuration continues.

Herein lies the problem that most System Admins are fretting over. "DSC can restart my server at any time?" they cry.

Unfortunately, if this option is set to true, it can...

## My Suggestion

So, the obvious thing to do is set the RebootNodeIfNeeded property to false; and that is exactly what you should do.

We have now created another problem, but this problem is easier to solve.

### Scenario 1: Bootstrap/Deployment

During the initial deployment of the machine, create a scheduled task which runs every 15 minutes for example and queries the LCM whether it needs a restart or not, if so, then it restarts the computer.

To prevent the task running after the initial deployment, the task can either have an expiration date set for 1 day later (for example) or the task can be removed as part of an on boarding process.

### Scenario 2: Maintaining/Support

Assuming you have a patch management plan, the reboot status can be queried the same way and restarted as part of the normal scheduled maintenance.

### Querying the LCM for pending restarts

```powershell
function Test-DSCRebootRequired {
    $JobStatus = Get-DscConfigurationStatus
    if ($JobStatus.RebootRequested) {
        Write-Verbose "Reboot requested, checking LCM is idle"
        $LCMState = Get-DSCLocalConfigurationManager
        if ($LCMState.LCMState -eq "Idle") {
            Write-Verbose "LCM is idle, good to restart"
            return $true
        } else {
            Write-Verbose "LCM State: $($LCMState.LCMState)"
            return $false
        }
    } else {
        Write-Verbose "Reboot not requested"
        return $false
    }
}
```

Hopefully this let's you keep in control of how and when DSC is rebooting your servers. It isn't the most complicated solution out there, but it works.

I know it's only day 4 but the support for this serious has been immense. There are seemingly a lot of budding DSC engineers out there, which can only be a good thing!

See you tomorrow
&
Don't Forget To Automate It!
