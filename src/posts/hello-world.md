---
view: post
layout: post
lang: en
author: rdbartram
title: Hello-World!
description: The very first blog post I've ever written. Setting out some expectations for the future and of course, a bit of PowerShell.
excerpt: The very first blog post I've ever written. Setting out some expectations for the future and of course, a bit of PowerShell.
cover: true
coverAlt: Golden robot standing next to sign saying Hello World.
demo:
audio:
categories:
  - updates
tags:
  - helloworld
  - powershell
created_at: 2017-04-06 19:00
updated_at: 2017-04-06 19:00

meta:
  - property: og:image
    content: /images/posts/2017/4/hello-world.png
  - name: twitter:image
    content: /images/posts/2017/4/hello-world.png
---


Hello to everyone who's looking for a place to come learn and improve their PowerShell, Automation and general programming skills.
By no means am I an expert but maybe this blog can work to become more than a sum of its parts. A collaborative effort between you and me.
If I were trying to be a nerd I would illustrate it as code...

```powershell
$currentlevel = 0
$goal = $currentlevel + 1
$participants = @("me")

while ($currentlevel -lt $goal) {
    #get comrade in arms
    participants += $user.you

    #learn something
    $currentlevel = learn $currentlevel

    #approaching goal
    if(($currentlevel + 1) -eq $goal) {
        $goal = move-goalpost $goal
    }
}

function learn ($level) {
    return $level++
}

function move-goalpost ($goal) {
    return ($goal + (get-random -max 10))
}
```

I hopefully have a tonne of good content for you to learn and improve your PowerShell. Check out all my different [series](http://www.dftai.ch/category) in the menu. One series that I plan to have appear frequently is [That's What Shell Said](http://www.dftai.ch/twss/). It's always pinned to the menu and its where I will put all the short tips and tricks you want to know in order to be more efficient and hopefully a better automator. If you do ever want to reach out to me, either do so in the comments or with the #dftai. I am just starting to get into Twitter and hope that I can quickly answer your questions via a tweet. Follow me on Twitter [Follow @rd\_bartram](https://twitter.com/rd_bartram) and if you liked this post, please share it on social media with the hashtag #dftai.

Don't Forget To Automate It
