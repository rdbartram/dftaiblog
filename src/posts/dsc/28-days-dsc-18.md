---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 18 Sandboxing'
description: The first step to testing is being able to sandbox your development environment away from the rest of your machine
excerpt: The first step to testing is being able to sandbox your development environment away from the rest of your machine
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - pester
  - sandboxing
readtime: 5 min
created_at: 2018-02-18 08:00
updated_at: 2018-02-18 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 18 and a Sunday!

I don't want to give you too much to read so this will be a preparative post for next week.

The following posts are going to be heavily focused on testing and making sure our DSC Resources work before we send them off into the world.

The first step in this process is being able to sandbox your development environment away from the rest of your machine.

I guess the most common way of testing DSC Resources is to simply copy the test version of my resource into a folder in the PSModulePath, generally C:\Program Files\WindowsPowerShell\Modules.

The problem with this is that it potentially disrupts any active DSC Configurations you have on your machine. And in the case where you have a CI/CD solution and are automatically building lots of different versions of your code on a couple of build machines, you need to make sure they aren't influencing each other.

The way I achieve this is to update the environment variable. Setting and reversing this variable at the beginning of your test script means you can isolate PowerShell to exactly the directories are necessary for the test to run.

Having functions/methods like PrepareEnvironment and RestoreEnviroment allows me to bundle all my actions together such as setting the PSModulePath variable in order to isolate PowerShell to exactly those directories that are required, Create temporary files/directory etc. Everything that is necessary for the test to run.

Here is a basic example of the idea. In reality you have many more things you need to prepare and you probably don't want to include the Program Files and Documents Module paths. Just adjust it to your needs.

```powershell
function Prepare-Environment {
    [String] $ModuleRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $Script:MyInvocation.MyCommand.Path))

    $PSModulePathArray = $env:PSModulePath -Split ';'

    $env:PSModulePath = ($PSModulePathArray + $ModuleRoot) -join ';'
}

function Restore-Environment {
    [String] $ModuleRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $Script:MyInvocation.MyCommand.Path))

    $PSModulePathArray = $env:PSModulePath -Split ';'

    $env:PSModulePath = ($PSModulePathArray.Where({$_ -ne $ModuleRoot}) -join ';'
}
```

Very similar to the topic from yesterday in that we have these two functions/methods that exist in every test script. If they are written correctly, you should be able to take your code and run it anywhere and everywhere since you setup your environment during the prepare and tidy up again afterwards in the restore. It's like you were never there 👻.

As I said, the next few sessions are going to be focused on testing DSC with Pester. I'm interested to know how many of you are currently unit testing or integration testing your DSC resources. Let me know using the hashtag #28DaysOfDSC.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
