---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 22 Visualising DSC – What A Pretty Picture'
description: I was looking for a way to visualise DSC for a while and then I came across a project by Kevin Marquette
excerpt: I was looking for a way to visualise DSC for a while and then I came across a project by Kevin Marquette
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - troubleshooting
readtime: 4 min
created_at: 2018-02-22 08:00
updated_at: 2018-02-22 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 22! Today I wanted to so you how you can either waste a lot of ink, or at least show your boss and team what your DSC Config does without having to teach them how to read PowerShell.

I was looking for a way to visualise DSC for a while and then I came across a project by [@kevinmarquette](https://twitter.com/kevinmarquette).

He created a project called [PSGraph](https://github.com/KevinMarquette/PSGraph) which you can find in the PowerShell Gallery and on GitHub. It's a super cool module that allow to to render data as an image either png, jpg pdf etc.

Kevin has a lot of cool modules btw, you can check out his blog [here](https://kevinmarquette.github.io/).

So back to my DSC Visualiser, I saw this project and thought "hey, I've I can parse a MOF file, then I can use that information and pass it to PSGraph"

**_SPOLIER ALERT_**

That's exactly what I've done.

## DSC Visualiser

So there currently exists in my GitHub a repo called [PS-Tips-Tricks](https://github.com/rdbartram/PS-Tips-Tricks). There for example is where I will upload my final revision of the dftaiADUser class and related Unit Tests.

In this same repo also lies the DSCVisualiser module. It has functions within that enable you to parse any MOF file and read it as a PowerShell Object. Also included is the magic function which is New-DSCVisualisation.

This is the command which actually creates the image.

```powershell
$Config = Read-DSCMOFConfiguration .\localhost.mof
New-DSCVisualisation -Config $Config
```

After running this command, the image will immediately be opened and look something like this.

![SQL DSC Diagram](./images/SQLDSCDiagram.png)

Pretty cool right?

I've used it on files upto 2 MB in size. Just be careful as it starts to degrade in quality because it has some limit built in.

I need to look a little more in detail anyway because it annoys me that the diagram isn't the most beautiful. I will be adding style support soon 😄.

I will try an polish the module off a bit. Add some more parameters such as output type and whether you want to include the properties of the dsc resource or not. Then at some point publish to the PowerShell Gallery.

All in good time, be patient.

So that's it! That's all I wanted to show you today. A really cool way to get an overview of how your config/configs look. Bare in mind you you could merge multiple configs together to see more than one at the same time, a la [Partial Configurations](28-days-dsc-14).

So thanks for stopping by and see you again tomorrow!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
