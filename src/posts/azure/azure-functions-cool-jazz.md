---
view: post
layout: post
lang: en
author: rdbartram
title: "Azure Functions: How Cool Is This Jazz!"
description: A practical demonstration of Azure Functions with PowerShell and C#. API webhooks, Messaging Queues, Cosmic DB. Code as a Service is here.
excerpt: A practical demonstration of Azure Functions with PowerShell and C#. API webhooks, Messaging Queues, Cosmic DB. Code as a Service is here.
cover: false
demo: https://github.com/rdbartram/AzureFunctions-Spotify
categories:
  - azure
tags:
  - azure functions
  - json
  - powershell
created_at: 2017-09-06 19:00
updated_at: 2017-09-06 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

Hey Guys! I'm back again for another series, this time I'm going to show you everything I know about Azure Functions.

They aren't that new anymore but I still think they are a well underutilized part of Azure and something that isn't blogged about enough.

They cost almost nothing to run, they are so easy to use when building process workflows and the fact you can run them on-prem like Azure Runbooks makes it even easier for enterprises to jump on the Azure Functions band wagon.

A quick run down of how this series is going to work. I've got a series of topics I want to discuss and I'm going to try and get to all of them as quickly as I can.

Below is a list of links to all the currently available posts so it's easy for you guys to jump from topic to topic. If you'd like something covered that I haven't written about, comment or tweet me and I'll try to respond to you and if necessary get a post done as soon as possible.

## Topics

* Timers and Webhooks
* Azure Queues and Cosmos DB
* Function Keys and key specific configuration data
* Monitoring with Insights and OMS
* Unit testing C#, JavaScript & PowerShell

## What are Azure Functions?

I guess before we get into the nitty gritty of how to develop and configure them, it would be good to know, what are Azure Functions?

Really simply put, they are generally small pieces of code or **Functions** that run within Azure, triggered by schedule, webhooks, messaging queues, blob storage and many others.

They can be written in many different languages including C#, JavaScript, PowerShell, Bash, TypeScript among others. These things really are so flexible and allow almost any developer to come write in their preferred language and connect to whatever they want.

## Overview of Example

Throughout these posts I'm going to be referring to a series of functions I have written to control Spotify. I have published a PowerShell module over on [GitHub](https://github.com/rdbartram/PSSpotify) which is a wrapper for the Spotify public API.

Checking out the actual functions code on [GitHub](https://github.com/rdbartram/AzureFunctions-Spotify) you'll see there are 4 Functions defined.

* **SaveSpotifySessionInfo** - this allows you to upload the clientIds and secrets used for oAuth. They are saved per function key
* **SpotifyGraphHook** - this is an endpoint for a Microsoft Graph subscription and is triggered every time you get an email and writes the subsequent request into an Azure Messaging Queue
* **SpotifyPlaySong** - triggered by messages in the queue. The JSON body is parsed and searches for a song before playing it on the most recently used Spotify device
* **SpotifyStart** - this simply resumes playback on the last used Spotify device

## Timers

Starting off with the easier of the two triggers, Timer triggers are configured to run on a schedule using CRON expressions. Azure does have examples in the documentation when creating the function, but briefly: CRON has 6 fields which you can use to define when the job should start. The format looks like this **{second} {minute} {hour} {day} {month} {day of the week}**.

![Azure Function Timer Trigger](./images/timer.jpg)

Although they are still being used quite a lot for all sorts of processes, timers are on the decline. They are inefficient and as a result cost a lot more money to run.

If you think you'd run a function once every hour or so; say to check if new entries were written to a SQL table. Most of the time there may not be any new data, regardless, you are paying for the privilege of checking. If however you could subscribe to an event which started your function when a new entry has been written to the database, the function would only be triggered when it was needed. This means you are using less compute time and in turn saving money.

## Webhooks

The concept of subscribing to events and having your code triggered this way is not new at all but it's something Microsoft is investing in heavily with Azure; they call it EventGrid. Microsoft is implementing many different event handlers into Azure, but the one that is most well known and implemented everywhere is the webhook.

Webhooks are just HTTP Rest Endpoints that accept an event and do something with it. For example you may wish to deploy resources to Azure everytime a commit is pushed to GIT.

What is happening here is an event is being triggered when the commit is pushed and the webhook being triggered parses the information from the event and deploys the next version of the app currently residing in GIT.

Easy? Let's try creating a PowerShell webhook to do something similar. The commit example is used quite often, so lets get alerted when issues are created for my repo in GitHub instead.

To do this you will need the following:

* Azure Account
* GitHub Account
* A code repository in GitHub

Once you have all of those, you'll need a function app. If you haven't got one, create one in the Azure Portal like so.

<lazy-load tag="img" :data="{ src: 'https://docs.microsoft.com/en-us/azure/includes/media/functions-create-function-app-portal/function-app-create-flow.png', alt: 'create azure function' }" />

The Function App is the container for all the Functions you will develop. To create a function and you are presented with the quick start menu, click the 'create your own function' hyperlink, else clicking on the + or 'New Function' button.

Create a PowerShell HTTP Trigger like so.

![powershell http azure function](./images/powershell-http-function.png)

At this point you have a function that expects a JSON object with a property called name. If you call it and pass Ryan as the name, you will get the response "Hello, Ryan".

To integrate this function with GitHub and do something a bit more interesting we'll need to make some changes to the trigger. In the Functions pane on the left, click 'Integrate' under your function and then on the trigger. We need to change the mode from standard to Webhook and confirm the Webhook type is GitHub as in the screenshot below.

![powershell http github trigger](./images/powershell-http-github-trigger.png)

After returning to the coding console by clicking on the name of your function, paste in the following code snippet and save it.

```powershell
$data = get-content $req -raw | convertfrom-json

    $Issue = \[pscustomobject\]@{
        Repo = $Data.repository.name
        User = $Data.issue.user.login
        title = $Data.issue.title
        body = $Data.issue.body
    }

$Issue | ft | out-string
```

That's it, you've written an Azure Function! You can see the Function takes the input from the trigger ($req) and outputs a pscustomobject with a couple of useful properties from the GitHub issue i.e Repository name, the user that created the issue etc.

Obviously, writing this information out to the console isn't all that interesting but imagine you could trigger other processes based on this webhook. Maybe create a ticket, send yourself a text using [Twilio](https://www.twilio.com/) etc. Linking all these components together can make for a powerful solution.

As of right now, you have a function but nothing is triggering it. To configure GitHub to trigger your function, complete the following steps.

Make note of your Functions URL and Secret.

![github secret](./images/http-github-url-secret.png)

Head into the settings of your GIT Repo and create a new webhook

![github webhook](./images/github-repo-webhooks.png)

Fill in the URL and Secret copied from Azure, make sure the content type is set to application/JSON otherwise you'll end up with a HTTP 415 error. The webhook can also be filtered to only fire when issues are created, do that by checking the 'let me select individual events' button and checking 'issues'.

![create azure function trigger](./images/github-add-webhook.png)

Upon saving, GitHub should send a test message to your function. The state of which can be seen at the bottom of the newly created webhook by Recent Deliveries or in the Azure Function in the Monitor tab.

> <lazy-load tag="img" :data="{ src: 'https://i1.wp.com/icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png?w=75', alt: 'warning icon', width:75, style:'float:left; margin: 0 15px 0 0' }" /> If you would like to know more about the JSON object being sent to your function, you can expand the item in Recent Deliveries and see exactly what was in the header and the body. For testing it is useful, to be able to resend the event, this can also be done from here.

## Conclusion

So... We've covered a lot of new topics here; Webhooks especially are something I expect a lot of traditional PowerShell/infrastructure guys haven't had to deal with.

I really hope this quick overview will encourage you to try it out for yourself. I know as soon as you get coding, you'll be finding all sorts of uses for Azure Functions. And hey, maybe you'll even branch into another coding language.

If you do write anything cool, tweet me a link to your Git Repo so I can check it out. Equally, if you get stuck, hit me up or ask the community. PowerShell in Azure Functions is still a bit of a niche thing but raise issues on Microsoft's GitHub if you find any, we all want it to succeed.

Don't forget to check back for the other Azure Function instalments.

And lastly, Don't Forget to Automate It!
