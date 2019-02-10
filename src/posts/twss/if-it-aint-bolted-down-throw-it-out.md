---
view: post
layout: post
lang: en
author: rdbartram
title: If It Ain't Bolted Down, Throw It Out!
description: Want to know how to avoid returning unwanted data to the console whilst at the same time increasing the speed of your scripts? Using [void] can do just that
excerpt: Want to know how to avoid returning unwanted data to the console whilst at the same time increasing the speed of your scripts? Using [void] can do just that
cover: false
coverAlt:
demo:
audio:
categories:
  - twss
tags:
  - powershell
created_at: 2017-06-26 19:00
updated_at: 2017-06-26 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

Recently I was shown an article that was talking about how we shouldn't be friends with Write-Output anymore; it was written by Markus Kraus from [Get-PowerShellBlog](https://get-powershellblog.blogspot.ch/2017/06/lets-kill-write-output.html).
I thought his idea was good and there is a lot of talk in the community lately about improving performance within scripts and modules.
This lead to me see how much I could improve the speed of my functions by reducing the weight. If it ain't bolted down, throw it out!

The basic summary of Markus's blog is that since every time you use Write-Output you are doing something PowerShell does by default, which is output everything to the output stream.

This is where my interest peaked, since I am a hobby C# developer, I thought to myself, what if I were to define my functions as void methods?

In PowerShell, anything not written to a variable or passed along the pipeline is output. This really caused me a headache once when developing a DSC Resource. I remember getting a strange error preventing my Set methods from running, all because my Test methods were returning multiple Booleans.

Why? you ask, was I returning multiple Booleans, you fool. I needed to pull specific parts of string and was using RegEx and the -Match operator and the subsequent $Matches variable. Foolishly, I didn't Out-Null or save the output of -match, hence the Boolean was output.

What I want to show you today is there is a way you can emulate the behaviour of Binary Modules (outputting only that what you explicitly say) in your script modules. This has the benefit of both speed and the knowledge that only things you explicitly output which show up in the success stream.

Code
====

The way to implement this into your code only requires one key word \[void\]. This one keyword works similar to | Out-Null but doesn't require the data to first be sent through the pipeline.

```powershell
function test {
    [cmdletbinding()]
    param()
    process {
        [void]$(
            New-Item -Type directory -Name "Test"
            New-Item -Type File -Name test.txt -path .\test
            $pscmdlet.writeobject([pscustomobject]@{
                File      = "C:\test\test.txt"
            })
        )
    }
}
```

There is of course a bit of fluff I wrote and the code itself doesn't do anything particularly useful but this is a case where a cmdlet returns an object which you don't always want.
Of course, I could save the output to a variable or use | Out-Null but this way the code acts more like a developer would expect and in my opinion is a little cleaner.

In essence you need only wrap your code in \[void\]$() and hopefully you can see the advantage of not having to Out-Null or save everthing in a variable. This makes sure that any objects being returned from this block are dropped.

The way you return objects from within the \[void\] is by calling the WriteObject method on $PSCmdlet. This is actually all the Write-Output command does anyway.

Additional to the way the code looks, I have seen performance increases in large iterations using the \[void\] block over Out-Null etc. When doing things like enumerating users in a domain, parsing records in db or files on disk. These small 5, 10, 100 millisecond savings add up.

Take the the example below and test it yourself.

```powershell
function Unwrapped {
    \[cmdletbinding()\]
    param()
    process {
        (gci C:\\ -Recurse | select -ExpandProperty name) -match 'power' | out-null

        write-output $matches.count
    }
}
function wrapped {
    \[cmdletbinding()\]
    param()
    process {
        \[void\]$(
            (gci C:\\ -Recurse).name -match 'power'

            $pscmdlet.WriteObject($matches.count)
        )
    }
}

$uTime = Measure-Command -Expression {Unwrapped}

$wTime = Measure-Command -Expression {wrapped}

write-host "Piped command execution time: $($uTime.seconds)"
write-host "Voided command execution time: $($wTime.seconds)"

write-host "Void is $(\[int32\]($utime.Seconds/$wtime.Seconds\*100))% faster than piping to null"

Piped command execution time: 50
Voided command execution time: 21
Void is 238% faster than piping to null
```

If you liked this post, please share it on social media with the hashtag #DFTAI [. Tweet](https://twitter.com/intent/tweet?text=#DFTAI).

If you want to find more posts regarding PowerShell Tips, Tricks and ways to make your code or coding better, check out all the [That's What Shell Said](/categories/twss/) Posts.

And with that, That's What Shell Said... Don't Forget To Automate It!
