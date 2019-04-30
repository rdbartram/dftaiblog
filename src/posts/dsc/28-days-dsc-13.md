---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 13 DSC Pull Server - Why DSC Manager?'
description: The LCM (Local Configuration Manager) can not pull its config from a Pull Server like it can a normal configuration; rather it has to be pushed
excerpt: The LCM (Local Configuration Manager) can not pull its config from a Pull Server like it can a normal configuration; rather it has to be pushed
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - DSCManager
  - PullServer
readtime: 9 min
created_at: 2018-02-13 08:00
updated_at: 2018-02-13 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 13...if I was suspicious, I would have avoided this post...I guess I'll just have to be careful.

Anyway...

Yesterday, I showed you how to get the DSC Manager installed and deployed to your clients. Today, its about the why.

## Problem With DSC Today
Today, DSC is a amazing way to deploy any and all sorts of applications, configurations and generally a way of automating your environments.

However, there is always the question, how do you onboard your clients? and how do you maintain these configurations over time?

The LCM (Local Configuration Manager) can not pull its config from a Pull Server like it can a normal configuration; rather it has to be pushed. This means that for secure evironments, you need to: 1. Allow network access to the clients and 2. You need to save credentials to access said clients.

The other big issue that people experience with DSC is reporting and monitoring the clients after the configurations have been pushed.

## DSC Manager Is The 🔑

DSC Manager itself is a .Net Core web app written to be highly available and highly extensible.

Running on a SQL backend, it can easily be made highly available by scaling out the stateless web frontend and the redirecting the backend to a highly available SQL Server Always On Cluster.

Using certificate authentication and requiring only inbound connection to the DSC Manger from the clients, it is inherently more secure.

DSC Manager sets out to resolve the problems explained above and more, making DSC the easy choice when it comes to automation.

Firstly, the reporting and monitoring within DSC isn't bad. There is alot of data which is sent back from the LCM to the Compliance Server role. It is unfortunately, difficult to retrieve and present in an easy to understand manner.

Looking at the screenshots below, you can see how it is to get an overview of the state of your agents.

![DSC Report View](./images/DSCReportView.png)

![DSC Error View](./images/DSCErrorView.png)

Moving on to a agent that is correctly configured, you can see here that the last consistency check was successful that this agent has 10 resources currently active.

![DSC Agent Success](./images/DSCAgentSuccess.png)

When all isn't good in the land of DSC, then you are quickly alerted and can see exactly what resource is out of state and why.

If needed you could create a new version of the config and assign it from the portal. The agent will see this change and set it locally in the LCM. The process is detailed below.

![DSC Error Agent Log](./images/DSCErrorAgentLog.png)

The next useful feature DSC Manager has up it's selve is being able to set the LCM remotely.

Using the custom pull client, DSC Manager is able to set the LCM with all the necessary parameters; the same as you would locally.

For example, controlling if the LCM can trigger restarts, how often it looks for new configurations, the mode it which it sets/monitors them i.e Apply and Monitor or Apply and Correct.

Imagine being able to schedule reboots to only occur during a window of opportunity that you and business define!

![DSC Set LCM](./images/DSCSetLCM.png)

The last thing the DSC Manager is currently able to do in terms of the LCM is configure which configuration(s) it pulls. I write "(s)" because DSC Manager supports more than one configuration per node simultaneously (partial configurations).

Multiple configurations can be added and made dependent upon each other.

![DSC Assign Multi Config](./images/DSCAssignMultiConfig.png)

## DSC Manager Going Forward
The goal for DSC Manager in the first phase was to bring equal parity with the current DSC Pull Server. I think those expectations have been met and to some extent exceeded.

What the next phase entails is pushing the boundaries and enabling DSC to reach it's full potential as an automation tool.

Features currently on the roadmap include:

- Configuration Visualiser
- Complete Configuration Encryption
- PowerShell module based on RESTful API
- Webhooks
- Improved Reporting

These are things I see as things that will immediately add value to your DSC deployments as well as increase the speed of adoption for those among you not currently using DSC.

If there are features you want or there is a feature here that you already like, I want to hear about it. Tweet me directly or use the hashtag #DSCManager.

And that is the power currently made available by DSC Manager. Head over to [itnetx](http://itnetx.ch/products/dsc-manager/) to download your free 5 client license. There is nothing lose and everything to gain!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
