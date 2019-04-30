---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 25 Reverse DSC - How Does It Work 🧐'
description: I'm going to keep this one relatively short and explain how ReverseDSC was designed to work and how it can be improved. All the while laying the ground work for creating our own ReverseDSC Scripts.
excerpt: I'm going to keep this one relatively short and explain how ReverseDSC was designed to work and how it can be improved. All the while laying the ground work for creating our own ReverseDSC Scripts.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - reverse dsc
readtime: 7 min
created_at: 2018-02-25 08:00
updated_at: 2018-02-25 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 25! Really not long to go now. Since it's Sunday I'm going to keep this one relatively short and explain how ReverseDSC was designed to work and how it can be improved. All the while laying the ground work for creating our own ReverseDSC Scripts.

Ok! So I showed you yesterday how you can run a ReverseDSC Script in order to create a DSC Configuration Script.

Question is did any of you try it out?...

If you did, you would've seen its not the best if you want to reuse and edit the configuration after the fact...let's see if we can't fix that!

## Reverse.ps1

So you'll see that each ReverseDSC project has several commonly occurring components. Some of which are so similar between the different projects that they could be abstracted to standardise ReverseDSC even more (But more on that another day).

Here is a list of the functions and their purpose:

- **Orchestrator**
  Orchestrator is considered the workhorse of ReverseDSC, it's purpose is to run almost all other functions in order to query the system as to it's current state and generate the configuration script.

- **Set-ConfigurationData**
  I was a bit upset when I first saw how this function worked. In all cases except SharePoint, which is always a special case, this function just creates an AllNodes Array with one computer in it. It allows the passwords to be saved in plain text and its saved directly into the script.

- **Set-Imports**
  This functions role is to set the Import-DSCResource commands at the beginning of the configuration script.

- **Set-LCM**
  This is another function which disappointed me a little. In all cases including SharePoint, all this function does is statically set the LCM to allow restarts when requested the LCM. In my opinion, this could of read out the current LCM Config if it had one.

- **Get-ReverseDSC**
  This is the only "public" function as it were. This is the only function that gets called directly and is responsible for executing the orchestrator and saving the resulting output to the DSC Configuration script.

## Beyond The Standard Functions

Seeing that Orchestrator is responsible for gathering the current state. How exactly does it do that?

Well, as I hope you know by now, DSC has 3 functions which are fundamental to the design of DSC, get, test and set. Only by getting the current state is DSC able to determine if the machine is in fact in it's desired state or not.

Orchestrator and so ReverseDSC, takes advantage of this feature by using the Get-TargetResource function in order to both determine which parameters need to be passed and what their values should be.

This seems all well and good but maybe you've noticed a problem...Orchestrator runs "Get-TargetResource" and unfortunately this means it only supports script resources. It's currently something baked into the ReverseDSC.Core and would potentially be a breaking change for all other ReverseDSC projects if it were to be updated.

My second problem is since it uses the Get-TargetResource to determine the input parameters for the configuration, Read properties are accidently included. This of course means the resulting script doesn't work. I am currently working on resolving by reading the MOF file and not module itself.

Other issues I have are that the scripts today are currently written as functions that don't having nice inputs and outputs. When I was first reading the different projects I found it quite difficult to track what was going on with the use of the script variables.

Also, the way in which the configuration data is generated today for all the projects excluding SharePoint means that the configuration script is very busy with information. Not very easy to update, and in my opinion not generally a good idea.

In the version I'll show you guys tomorrow, I have separated out the ConfigurationData into a separate file and everything data related is there. The configuration script is a parameterised as it possibly can be.

And on that thought, tomorrow will be more fixated on code and demonstrations. How can we take what we've learnt today and translate it into our own ReverseDSC script.

Just so you aren't disappointed tomorrow, I haven't got round to implementing class based resource or read property support but I hope my reverse script is better encapsulated and easier for you guys to understand.

Hope you guys are looking forward to it!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
