---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 15 Class Based Resource Part 1 - Classes'
description: PowerShell Classes are a new feature that we were gifted back when PowerShell 5 was new and shiny
excerpt: PowerShell Classes are a new feature that we were gifted back when PowerShell 5 was new and shiny
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
readtime: 9 min
created_at: 2018-02-15 08:00
updated_at: 2018-02-15 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 15 and we are making our way toward the modern and hipster features of PowerShell.

Now before you switch off because you think...erh Classes and PowerShell...they don't go together. Hear me out. I think after these next 2 posts you might just change your mind. Be a #PowerShellHipster.

PowerShell Classes are a new feature that we were gifted back when PowerShell 5 was new and shiny. The problem is since we generally have to support legacy environments PowerShell classes are something not often implemented.

I develop generally and especially all my DSC Resources are script based. When WMF 5 first came out I spent ages developing VMWare classed based resources only to have someone tell me that they we going to have to run on an old 2008 R2 server running PowerShell 4.0. Damn!

Since then I've kind of shied away from using it unless I knew everything in that project was WMF 5 and that the team was willing to support it.

At the end of the day, if no one can or is willing to help you support the code you develop, it's going to be a long and lonely time.

If you head over to [docs.microsoft.com](https://docs.microsoft.com/en-us/powershell/dsc/authoringresourceclass), there are more infos about Class based resources. Check this post out first 😉.

## The Basics

Classes are a feature of many different programming languages. Their functionality can vary slightly between languages but generally speaking a class is a template. With it you can define how something should look or operate.

For us it's a way to store data and perform actions. Similar to how we have functions and variables but combined into one.

For example the string class stores a series of letters or chars and it has a couple of methods like split. Split allows you to take that list of chars and split it to a various other lists when for example there is a space.

If we talk about DSC we know that each resource (class) has at least 3 actions (methods) get, set and test. The data that is holds are the parameters you pass to it.

If we take our example from the script based resource i.e. create an AD user, let's see what each part would look like if it were a Class instead of a module.

Here's our basic parameter definition

```powershell
class dftaiADUser {

    [string] $Username

    [pscredential] $DomainAdministratorCredential

    [PSCredential] $Password
}

$MydftaiADUser = [dftaiADUser]::new()
```

Here our Class has been defined with the name dftaiADUser, it has 3 properties and at the end I just created a copy (instance) of dftaiADUser and saved it in the \$MydftaiADUser variable.

I can assign the values of the dftaiADUser like this:

```powershell
$MydftaiADUser = [dftaiADUser]::new()

$MydftaiADUser.Username = "Ryan"
$MydftaiADUser.Password = New-Object PSCredential -ArgumentList 'Ryan', (ConvertTo-SecureString 'MySecretPassword!' -AsPlainText -Force)
```

Seems easy enough. Lets work on some actions (methods).

The Syntax to set the password it much to complicated for me to type in every time. Normally I would create a function which accepts my plain text password, returns a PSCredential, then save that to my \$MydftaiADUser variable.

With Classes I can do this easily.

```powershell
class dftaiADUser {

    [string] $Username

    [pscredential] $DomainAdministratorCredential

    [PSCredential] $Password

    [void] SetPassword ([string]$Password) {
        $this.Password = New-Object PSCredential -ArgumentList $this.Username, (ConvertTo-SecureString $Password -AsPlainText -Force)
    }
}

$MydftaiADUser = [dftaiADUser]::new()

$MydftaiADUser.Username = "ryan"
$MydftaiADUser.SetPassword("MySecretPassword!")
```

So, here are a couple of new things you might not of seen before.

1. The [void] keyword before SetPassword.
   What this means is that the SetPassword method does not return anything. In a Class all your methods have to include a return type. Similar to the [OutputType()] keyword for PowerShell functions. Except here PowerShell makes sure you return that type. If I tried to return something from a void, nothing would happen because [void] means nothing.

2. the $this variable.
$this is a special variable and works similar to $_. It basically means the object you are currently working with. Because I set the username as 'ryan', when I called $this.username from SetPassword, it knew I meant 'ryan'.

## DSC Class definition

To take this example and turn it into a DSC Resource we need only a couple extra keywords. The entire converted resource is here for you to compare with the script based one. Which is better? Or rather which is easier to understand?

```powershell
enum Ensure {
    Absent
    Present
}

[DscResource()]
class dftaiADUser {

    [DscProperty(Key)]
    [string] $Username

    [DscProperty(Mandatory)]
    [PSCredential] $Password

    [DscProperty()]
    [PSCredential] $DomainAdministratorCredential

    dftaiADUser () {
    }

    dftaiADUser ([Object]$ADUserObject) {
        $this.Ensure = [ensure]::Present

        if (!$ADUserObject) {
            $this.Ensure = [Ensure]::Absent
        }

        $this.Username = $this.Username
        $this.Password = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
        $this.DomainAdministratorCredential = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
    }

    [dftaiADUser] Get() {
        AssertPrerequisites

        $GetADUserParams = $this.NewGetADUserParameters

        $ADUser = Get-ADUser @GetADUserParams -ErrorAction SilentlyContinue

        $ReturnObject = [dftaiADUser]::New($ADUser)

        return $ReturnObject
    }

    [void] Set() {
        AssertPrerequisites

        $GetADUserParams = $this.GetADUserParameters

        $ADUser = Get-ADUser @GetADUserParams -ErrorAction SilentlyContinue

        if ($this.Ensure -eq [Ensure]::Present) {
            $NewParams = $this.NewADUserParameters

            if (!$ADUser) {
                $ADUser = New-ADUser @NewParams
            }
        }

        If ($this.Ensure -eq [Ensure]::Absent) {
            $RemoveParams = $this.RemoveADUserParameters

            $ADUser | Remove-ADUser @RemoveParams
        }
    }

    [bool] Test() {
        $CurrentState = $this.Get

        return Validate($CurrentState, $this)
    }

    static [void] AssertPrerequisites () {
        if (Get-Module ActiveDirectory -ListAvailable) {
            Import-Module ActiveDirectory
        }
        else {
            Throw "ActiveDirectory Module is not installed"
        }
    }

    [hashtable] GetADUserParameters () {
        [hashtable]$ReturnObject = @{}

        $Filter = @()
        if ($this.Username) {
            $Filter += "SAMAccountName -eq= '$($this.Username)'"
        }

        if ($this.DomainAdministratorCredential) {
            $ReturnObject.Add("Credential", $this.DomainAdministratorCredential)
        }

        if ($Filter.Count -gt 0) {
            $ReturnObject.Add("Filter", $Filter -join ' -and ')
        }

        return $ReturnObject
    }

    [hashtable] NewADUserParameters () {
        [hashtable]$ReturnObject = @{}

        if ($this.Username) {
            $ReturnObject.Add("Name", $this.Username)
        }

        if ($this.Password) {
            $ReturnObject.Add("AccountPassword", $this.Password)
        }

        if ($this.DomainAdministratorCredential) {
            $ReturnObject.Add("Credential", $this.DomainAdministratorCredential)
        }

        return $ReturnObject
    }

    [hashtable] RemoveADUserParameters () {
        [hashtable]$ReturnObject = @{}

        if ($this.DomainAdministratorCredential) {
            $ReturnObject.Add("Credential", $this.DomainAdministratorCredential)
        }

        return $ReturnObject
    }

    static [bool] Validate([dftaiADUser]$Reference, [dftaiADUser]$Difference) {

        $IsValid = $true

        @("Ensure", "Username").Foreach( {
                if ($Reference.$_ -ne $Difference.$_) {
                    Write-Verbose ("State of {0} does not match desired state" -f $_)
                    $IsValid = $false
                }
            })

        return $IsValid
    }
}
```

So what do you guys think of PowerShell Classes? Cool right?

Tomorrow I'm going to go into more detail about PowerShell Classes. How we can get even fancier to make our code more reusable and hopefully get you guys writing your own PowerShell Classes.

Just generally writing PowerShell with Classes can potentially be easier than writing scripts. Just the nature of Classes can be more suited to certain projects.

Let me know your thoughts using the hashtag #DFTAI.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
