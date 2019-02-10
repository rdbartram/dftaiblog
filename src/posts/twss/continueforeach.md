---
view: post
layout: post
lang: en
author: rdbartram
title: Can I continue my Foreach loop please?
description: You expect foreach continue in PowerShell to be able to skip to the next item. However why when with % { continue } do you seemingly break out of your loop?
excerpt: You expect foreach continue in PowerShell to be able to skip to the next item. However why when with % { continue } do you seemingly break out of your loop?
cover: false
coverAlt:
demo:
audio:
categories:
  - twss
tags:
  - powershell
created_at: 2017-05-31 19:00
updated_at: 2017-05-31 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

So I was writing some code today and came across a peculiar issue I expected to work and yet simply didn't. I was trying to query a REST API but unfortunately it didn't provide the means to pass a query string such as http://myapi.local/users?Name=Ryan.

So I ran all the objects through a loop and simply skipped the items that didn't match. Unfortunately, the code didn't work at all.

Debugging the code led me to see that the script was breaking out entirely instead of skipping to the next item.

This left asking myself, PowerShell, Can I continue my Foreach loop please?

My code looked like this

```powershell
Invoke-RestMethod -Uri 'http://myapi.local/Users' | % {
    if($\_.Name -ne "Ryan") { continue; }
    else { do-something }
}
```

Looks pretty straight forward right? However, it turns out that within a scriptblock i.e. my improvised foreach, continue works the same as break.

I raised an [issue](https://github.com/PowerShell/PowerShell/issues/3879) about this on GitHub in the PowerShell Core repo.

As I and others suggested, there are workarounds. You can do either of the following.

```powershell
Foreach ($User in Invoke-RestMethod -Uri 'http://myapi.local/Users') {
    if($User.Name -ne "Ryan") { continue; }
    else { do-something }
}
```

```powershell
Invoke-RestMethod -Uri 'http://myapi.local/Users' | % {
    if($\_.Name -ne "Ryan") { return; }
    else { do-something }
}
```

Using return within a Foreach-Object yields the same result as continue in Foreach statement.

I would say | % syntax looks cleaner and enables the option to use the -begin -process and -end blocks to better process the data. Additional to that, you could pipe the data further perhaps to POST the data back to the API after editing it.

Ed Wilson over at the Scripting Guys wrote a nice post about the difference between Foreach and Foreach-Object [here](https://blogs.technet.microsoft.com/heyscriptingguy/2014/07/08/getting-to-know-foreach-and-foreach-object/).

He explains that the Foreach Statement does yield performance benefits over the Foreach-Object cmdlet but only if you have enough memory to load the entire array.

The only thing I would say in regards to improving the examples above is Aliases are not recommended by Microsoft/PSScriptAnalyzer and for that reason Foreach-Object should be used instead of %. A small point but one that means your scripts will be better standardised and easier to read.

If you liked this post, please share it on social media with the hashtag #DFTAI.

If you want to find more posts regarding PowerShell Tips, Tricks and ways to make your code or coding better, check out all the [That's What Shell Said](/categories/twss) Posts.

And with that, That's What Shell Said...

and Don’t Forget To Automate It
