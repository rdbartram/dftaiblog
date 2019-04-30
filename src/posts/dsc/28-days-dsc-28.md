---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 18 The Finale'
description: For help debugging an troubleshooting DSC configurations and resources.
excerpt: For help debugging an troubleshooting DSC configurations and resources.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - troubleshooting
readtime: 9 min
created_at: 2018-02-28 08:00
updated_at: 2018-02-28 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Welcome to the last post in this series...😭.

Worry not because although the series has ended, DSC is something I am going to continually blog about, among other things.

If you've been following the series from the beginning you should be a real expert! A chance to celebrate being able to implement all the things covered over the last 28 days: Configuration, ConfigurationData, Script Resources, Class Resources, Nested Configurations, Partial Configurations, Reverse DSC etc etc.

This series is as much for me to solidify ideas in my mind as it is for you guys. The more you practice and use these features, the more you are going to have moments like this.

![celebrate](https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif)

The last thing before I get started with the last post. I will say it again at the end but thank you all so much for liking, reweeting, DMing and even just reading this posts. I never thought I would get as much traction as I got. The future is looking bright for DSC even if only half of you decide to take it up and use it actively in your companies.

## Dynamic Resource Trigger

So this is the resource I have alluded to a couple of times. It's something which I have rewritten based on previous experiences and allows you to firstly determine an appropriate time when the resource is allowed to run. In the event the resource is triggered outside of the operating hours then the test will simply return true. Albeit with a warning that the resource was executed outside of the allocated time window. This is really useful if you want to ensure that changes occur outside of production hours.
