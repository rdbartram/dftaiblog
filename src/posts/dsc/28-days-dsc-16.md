---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 16 Class Based Resource Part 2 - Classes Continued'
description: For those of you new to "real" development, this is going to be a steep learning curve
excerpt: For those of you new to "real" development, this is going to be a steep learning curve
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
readtime: 17 min
created_at: 2018-02-16 08:00
updated_at: 2018-02-16 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 16 and I want to follow up on the topic from yesterday, Classes.

I knowingly threw a lot of information at you so you could get an overview of a complete DSC Class Resource. I hoped you would be able to mull it over in your minds before coming back for the part 2.

In this post I want to systematically go over the features in PowerShell Classes and show you what it possible, whilst explaining how it can be useful for both DSC and normal Script development.

Just a quick side note. For those of you new to "real" development, this is going to be a steep learning curve. I'm going to try and make the explanations and examples as simple as possible but you may have to read it through a couple times and just practice until you get it.

Don't worry though, we were all beginners once 🙂.

## Structure

I did go over this yesterday but just to solidify it in your minds, Classes are a predefined template of how an object should look.

You can define things such as what data they store and what actions they are able to take. Very similar to how we use variables and functions.

In a way you can think of your current scripts as classes.

Here's our basic class definition with a couple of properties and methods.

```powershell
class dftaiADUser {

    [string] $Username

    [pscredential] $DomainAdministratorCredential

    [PSCredential] $Password

    [void] GeneratePassword() {
        #Default length is 20
        $Length = 20
        $this.GeneratePassword($Length)
    }

    [void] GeneratePassword(int32 $Length) {
        $Password = -join(33..126|%{[char]$_}|Get-Random -C $Length)
        $this.Password = New-Object PSCredential -ArgumentList $this.Username, (ConvertTo-SecureString $Password -AsPlainText -Force)
    }
}

$MydftaiADUser = [dftaiADUser]::new()
$MydftaiADUser.Username = "Ryan"
$MydftaiADUser.GeneratePassword()
$MydftaiADUser.Password.GetNetworkCredential().Password
C7PLo`hg+~c)63kw24M]
```

Here our Class has :

- been defined with the name dftaiADUser
- it has 3 properties

Then:

- I created a copy (instance) of dftaiADUser and saved it in the \$MydftaiADUser variable.
- I set the Username to Ryan
- I generated a password

A new feature here in this class, which is new in this class is overloading.

An overload is similar to Parameter Sets in your functions today. Overloaded methods can do different things depending on what you pass to them.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />Beware that they must be unique i.e. I couldn't have 2 GeneratePassword methods that accept an int32

In this case I have set it up so I can either explicitly say how long I want the password or leave it up to the method. In the method with no parameters, the default is 20 and I call the other overload passing the length as the default 20. Code Reuse 🤓.

A small additional feature that can be compared to the Export-ModuleMember command is the hidden and public keywords. Using these keywords it's possible to "hide" or show properties and methods.

Public is the default and doesn't have to be specified. Hide on the other hand must be explicitly written before the parameter type.

I say "hide" but it isn't very well hidden; PowerShell can easily access any other properties or methods of the class regardless of whether they are hidden or not.

If they are marked as hidden, they simply aren't in the console when you use Format-List for example.

So when would I use this.

```powershell
class dftaiADUser {

    [string] $Username

    [pscredential] $DomainAdministratorCredential

    [PSCredential] $Password

    hidden [string[]] $PasswordHistory

    [void] GeneratePassword(int32 $Length) {
        $Password = -join(33..126|%{[char]$_}|Get-Random -C $Length)
        if($this.IsPasswordInHistory($Password)) {
            Write-Warning "Password was recently used, please set another one"
        } else {
            $this.Password = New-Object PSCredential -ArgumentList $this.Username, (ConvertTo-SecureString $Password -AsPlainText -Force)
            $this.AddPasswordToHistory($Password)
        }
    }

    hidden [void] AddPasswordToHistory ([string]$Password) {
        #Password History is 10
        $MaxHistory = 10
        $this.PasswordHistory += $Password
        $this.PasswordHistory = $this.PasswordHistory | Select-Object -First $MaxHistory
    }

    hidden [bool] IsPasswordInHistory ([string]$Password) {
        $this.PasswordHistory -ccontains $Password
    }
}

$MydftaiADUser = [dftaiADUser]::new()
$MydftaiADUser.Username = "Ryan"
$MydftaiADUser.GeneratePassword(1)
$MydftaiADUser.GeneratePassword(1)
WARNING: Password was recently used, please set another one
```

Here you can see we are keeping track of the set passwords and saving them to a hidden variable \$PasswordHistory. In the event the password is the same as one of the last 10 passwords then we'll get a warning and the password won't be set.

I would seriously hope that my random password generator doesn't generate the same password twice, but anything is possible.

## Inheritance

Inheritance is a cool function of classes that allows you to define features in a "base" class and then simply import that functionality into your new class.

This has many uses for things such as polymorphism etc. But one feature you can imagine easily implementing is enforced structure/rules in your code/DSC resource.

For example, if I wanted that all my DSC Resources implemented the AssertPrequisites method, I could write a base class which has it and every DSC Resource Class I write simply imports the base class.

The syntax would look like this.

```powershell
class DSCTemplate {

    [void] AssertPrequisites([string[]] $Modules) {
        $Modules.Foreach({
            $Module = Get-Module -Name $_ -ListAvailable
            if(!$Module) {
                throw "Module '$_' not available"
            } else {
                Import-Module $_ -Force
            }
        })
    }
}

class MyNewDSCResource : DSCTemplate {

}

$MyNewDSCResource = [MyNewDSCResource]::New()
$MyNewDSCResource.AssertPrequisites(@("ActiveDirectory", "DNS"))
```

Here you can see we have the DSCTemplate class which actually holds the logic for the AssertPrerequisites method. However, since we inherited it with the MyNewDSCResource : DSCTemplate syntax, it is automatically there on the newly created MyNewDSCResource instance.

Taking it a step further, when necessary you can override this functionality in your class by just defining a method definition the same as that in the parent class. For my example, perhaps my AssertPrequisites imports PSSnapins and not Modules.

The syntax would like this.

```powershell
class DSCTemplate {

    [void] AssertPrequisites([string[]] $Modules) {
        $Modules.Foreach({
            $Module = Get-Module -Name $_ -ListAvailable
            if(!$Module) {
                throw "Module '$_' not available"
            } else {
                Import-Module $_ -Force
            }
        })
    }
}

class MyNewDSCResource : DSCTemplate {
    [void] AssertPrequisites([string[]] $Snapins) {
        $Snapins.Foreach({
            $Snapin = Get-PSSnapin -Name $_ -Registered
            if(!$Snapin) {
                throw "PSSnapin'$_' not available"
            } else {
                Add-PSSnapin $_ -Force
            }
        })
    }
}

$MyNewDSCResource = [MyNewDSCResource]::New()
$MyNewDSCResource.AssertPrequisites(@("ActiveDirectory", "DNS"))
```

The last thing I want to show you in terms of inheritance is how you can emulate an "Abstract" class. An abstract class is like the example from above, only that it defines what the class looks like, not how it should work.

What I mean with that is perhaps I want to guarantee that all classes have the AssertPrequisites method. However, because it's implementation is guaranteed to be unique each time I don't want to define my own version. Rather the developer of the class which inherits it must write his/her own implementation.

Since PowerShell can't do this by itself, we need to be a bit creative. My solution would be just to throw in the abstract class.

Like this:

```powershell
class DSCTemplate {

    [void] AssertPrequisites([string[]] $Modules) {
        Throw "Method not implemented"
    }
}
```

With this in place, unless the method is overridden in the child class, an exception will be thrown.

So I didn't realise this post would get so long. So in order that these can be easily read and understood within 5 mins or so I'll discuss the rest of the Class topics in tomorrow's post.

I hope this has been a useful post for you. If you're currently using PowerShell Classes, Tweet me and let me know how you've got it implemented using the hashtag #28DaysOfDSC.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
