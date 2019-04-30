---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 27 Classes Again?! 😣'
description: How can I support multiple DSC Class based resources, without having to save them all within the root module?.
excerpt: How can I support multiple DSC Class based resources, without having to save them all within the root module?.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
readtime: 9 min
created_at: 2018-02-27 08:00
updated_at: 2018-02-27 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

The penultimate post, day 27!

I'm trying to build the tension toward to the last post which is about a special custom resource which I think a lot of people have asked for and we wish could be integrated into the LCM natively...here's hoping the cross platform variant delivers.

Enough of that until tomorrow though...

Today I wanted to jump back into a topic which got a lot of mixed reaction from you guys. Some of you were keen on using class based resources....and others of you not so much.

What I wanted to address was a question I got asked about implementing multiple class based resources:

_How can I support multiple DSC Class based resources, without having to save them all within the root module?_

Fret not, my fellow DSC Hipster...there is in way to do this! I will try and get added to the docs.microsoft.com page along side this blog post.

What you might think to do, and this is what I did, is to straight up drop your class based resource in the DSCResources folder. In the module manifest, add a reference to the nested module and away you go.

DSC is a little horrid in this regard because it actually recognises your module properly. It even provides intellisense, compiles your MOF and you think "Oh yeah...I got it! 😎".

You take it to the machine you want to run it on, Start-DSCConfiguration and "Ha! You've been had" (Shout out to Tricia Van Camp).

![multi class error](./images/multiclasserror.png)

And this is when you start to scratch your head.

Without going into too much detail, the LCM generates the schema.mof for the class based resource based on the name of module, the version and the name of the class. Unfortunately, later during execution when the LCM tries to input said MOF, it looks for a module with the same name as the class, which in my case didn't exist. Hence, I got this error.

The way around this problem is to use a hard coded path for your class based resources. Script based resources belong in the DSCResources folder, and Class based resources belong in the DSCClassResources folder...duh!

I mean, was that not obvious to everyone 🤷?

This may seem like a trivial thing but with it not being documented to the best of my knowledge...It's just one of those things that if you didn't know, you would never think to try.

Just simply moving the class resource folder from DSCResources to DSCClassResources (and updating the parent module manifest) means that the LCM is able to properly reference the dynamically created schema.mof files.

![multi class success](./images/multiclasssuccess.png)

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />One last point. If you are still experiencing issues after doing this, try deleting the temp files from C:\Windows\system32\config\systemprofile\AppData\Local\dsc. I've had it that the class definitions weren't getting updated and it was because these files were old.

Anyway, that's it for today. I hope this saves you some time and hair pulling when trying to bundle multiple class resources into a single module.

Don't forget to come back for the last day of #28DaysOfDSC. I have a script based resource that I think you'll really like.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
