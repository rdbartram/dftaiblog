---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 17 Class Based Resource Part 3 - The Final'
description: The goal is to demonstrate some more complex, real life uses for classes. Not complex for the sake of being complex, rather beneficial and practical to the implementation of DSC and perhaps other Automation projects.
excerpt: The goal is to demonstrate some more complex, real life uses for classes. Not complex for the sake of being complex, rather beneficial and practical to the implementation of DSC and perhaps other Automation projects.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
readtime: 9 min
created_at: 2018-02-17 08:00
updated_at: 2018-02-17 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 17! People think that I had all these posts prepared in advance and was just simply releasing them everyday. I am far to spontaneous to do something like that. I had the idea to create the series so I did, hence the timing of the posts varies massively. Sorry!

I put in a lot of effort to make sure the posts get out everyday, even it's at 11:30pm ;). I hope you guys appreciate it and are benefiting from my efforts.

Anyway, to DSC and PowerShell Classes. The last 2 days have been strongly focused on PowerShell classes both generally and specifically to DSC. Since it is a topic which I feel a lot of PowerShell/Devops people aren't familiar with, I've taken the time to explain it as simple yet as thoroughly as I can. Apologies if that isn't the case.

I explained Inheritance in quite a bit of depth yesterday but I felt I was alot of theory and probably needed more real life PowerShell based examples in order to cement it in your minds.

The goal is to demonstrate some more complex, real life uses for classes. Not complex for the sake of being complex, rather beneficial and practical to the implementation of DSC and perhaps other Automation projects.

## Let's Begin

Very briefly said, Polymorphism is the concept that 2 separate pieces of code that express themselves the same way and yet behave differently.

Think about DSC and the fact that all DSC Resources must contain the get, set and test methods. <em>In Theory</em> the LCM doesn't know or care particularly at all what our custom resources are. It simply knows because all Resources inherit from a single parent DSC Class. That it can call the get, set and test methods exactly the same for Microsoft written resources as for custom resources written by you or I.

By default we only have the means to directly inherit from one class. Potentially the class could inherit from another class and so on, but when I create my class I can only specify one parent class...or can I?

Unfortunately as of today (Or at least to the best of my knowledge), you cannot write interfaces in PowerShell. There is however, nothing stopping you using them. Being able to do this, opens up to us a world of opportunities.

See here, we can implement the IEquatable interface in order that we can write our own custom Equals method.

```powershell
class dftaibase {

}

class dftaiADUser : dftaibase, IEquatable[dftaibase] {
    [string] $Username

    dftaiADUser ([string]$Username) {
        $this.Username = $Username
    }

    [bool] Equals ([dftaibase]$Other) {
        return $this.Username -eq $Other.Username
    }
}


$RyanBartram = [dftaiaduser]::new("Ryan")
$FranziBartram = [dftaiaduser]::new("Fränzi")
$RyanGosling = [dftaiaduser]::new("Ryan")

$RyanBartram.Equals($FranziBartram)
False

$RyanBartram.Equals($RyanGosling)
True
```

This might seem a little unnecessary but what we have now is an super easy way to check if two objects are the same. And since we are implementing the IEquatable interface it's enforced.

Hopefully you can imagine now replacing our Compare functions with overloaded Equals methods. The functionality was there before also with PowerShell scripting but it couldn't be enforced and it's implementation was different every time.

The only downside to implementing Interfaces in PowerShell is that you need to have class inherting from somewhere in order for the generic to work. This is because the IEquatable is a generic class and it can't find the dftaiADUser class while PowerShell is at the same time trying to creating it.
For me, I don't think its that much of an issue since I'm likely to need shared properties and methods between all my AD classes anyway i.e. users and groups both have a Name and Description etc.

For the typical CRUD DSC Resource i.e. Create, Modify, Delete AD Users, we could create ourselves a completely generic class structure to handle all the functionality and have a very minimal dftaiADUser class.

This would be my suggestion.

```powershell
enum Ensure {
    Present
    Absent
}

class dscbase {
    [Ensure] $Ensure = [Ensure]::Present
}

class dscCRUDbase : dscbase, IEquatable[dscbase] {

    static hidden [bool] $RunTestAfterSet = $true

    [bool] Equals ([dscbase]$Other) {
        $DesiredState = $true

        if ($this.Ensure -ne $Other.Ensure) {
            Write-Verbose ("State of Ensure is not equal to {0}" -f $this.Ensure)
            $DesiredState = $false
        }

        return $DesiredState
    }

    [dscCRUDbase] Get () {
        $this.AssertPrequisites()

        Write-Verbose "Gathering details..."

        $GetParams = $this.BuildGetParams()

        $Output = $this.ExecuteGet($GetParams)

        $ReturnObject = $this.GetType()::New($Output)

        return $ReturnObject
    }

    [void] Set () {
        $this.AssertPrequisites()

        if ($this.Ensure -eq [Ensure]::Present) {
            $CurrentState = $this.Get()
            if ($CurrentState.Ensure -eq [Ensure]::Absent) {
                Write-Verbose ("{0} does not yet exist. Creating..." -f $this.GetType().Name)
                $AddParams = $this.BuildAddParams()

                $this.ExecuteAdd($AddParams)
            }

            Write-Verbose ("Setting {0}..." -f $this.GetType().Name)

            $SetParams = $this.BuildSetParams()

            $this.ExecuteSet($SetParams)
        }
        else {
            Write-Verbose ("Removing {0}..." -f $this.GetType().Name)
            $RemoveParams = $this.BuildRemoveParams()

            $this.ExecuteRemove($RemoveParams)
        }

        if ($this.RunTestAfterSet) {
            Write-Verbose "Testing if configuration is not in desired state"
            if (!$this.Test()) {
                Throw "Configuration is still not in desired state"
            }
        }
    }

    [bool] Test () {
        $CurrentState = $this.Get()

        Write-Verbose "Comparing current state with desired state..."
        return $CurrentState.Equals($this)
    }

    static [void] AssertPrequisites() {
        Throw "Method not implemented"
    }

    [object] BuildGetParams() {
        Throw "Method not implemented"
    }

    [object] ExecuteGet([object] $Params) {
        Throw "Method not implemented"
    }

    [object] BuildAddParams() {
        Throw "Method not implemented"
    }

    [void] ExecuteAdd([object] $Params) {
        Throw "Method not implemented"
    }

    [object] BuildSetParams() {
        Throw "Method not implemented"
    }

    [void] ExecuteSet([object] $Params) {
        Throw "Method not implemented"
    }

    [object] BuildRemoveParams() {
        Throw "Method not implemented"
    }

    [void] ExecuteRemove([object] $Params) {
        Throw "Method not implemented"
    }
}
```

Hopefully, this doesn't seem all that complicated to you now, but the idea is that all the generic logic that we write every time for example in the get.

- Build params to actually get object from AD
- Execute Get
- Build return object

These 3 are always there now. All you have to do it populate the 3 internal functions that do the heavy lifting.

Same goes for Set and Test methods. All the logic regarding testing if the state is valid or not, when to create, modify or remove. It's all there.

To get this implemented with our dftaiADUser class, let's see what it takes.

```powershell
[DscResource()]
class dftaiADUser : dscCRUDbase {
    [DscProperty(Key)]
    [string] $Username

    [DscProperty(Mandatory)]
    [PSCredential] $Password

    [DscProperty()]
    [PSCredential] $DomainAdministratorCredential

    dftaiADUser () {
    }

    dftaiADUser ([Microsoft.ActiveDirectory.Management.ADUser] $ADUserObject) {
        $this.Ensure = [ensure]::Present

        if ($ADUserObject.SamAccountName -eq $null) {
            $this.Ensure = [Ensure]::Absent
        }

        $this.Password = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
        $this.DomainAdministratorCredential = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
    }

    static [void] AssertPrerequisites () {
        if (Get-Module ActiveDirectory -ListAvailable) {
            Import-Module ActiveDirectory
        }
        else {
            Throw "ActiveDirectory Module is not installed"
        }
    }

    [object] BuildGetParams() {
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

    [Microsoft.ActiveDirectory.Management.ADUser] ExecuteGet([object] $Params) {
        if ($Params -is [hashtable]) {
            $ADUser = Get-ADUser @Params
            if($ADUser) {
                return $ADUser
            } else {
                return New-Object -TypeName Microsoft.ActiveDirectory.Management.ADUser
            }
        } else {
            throw "Param type not supported"
        }
    }

    [object] BuildAddParams() {
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

    [void] ExecuteAdd([object] $Params) {
        if ($Params -is [hashtable]) {
            $ADUser = New-ADUser @Params
        } else {
            throw "Param type not supported"
        }
    }

    [object] BuildSetParams() {
        Write-Warning "Building Set Params not currently supported"
        return $null
    }

    [void] ExecuteSet([object] $Params) {
        Write-Warning "Set is not currently supported"
    }

    [object] BuildRemoveParams() {
        [hashtable]$ReturnObject = @{}

        if ($this.Username) {
            $ReturnObject.Add("Identity", $this.Username)
        }

        if ($this.DomainAdministratorCredential) {
            $ReturnObject.Add("Credential", $this.DomainAdministratorCredential)
        }

        return $ReturnObject
    }

    [void] ExecuteRemove([object] $Params) {
        if ($Params -is [hashtable]) {
            Remove-ADUser @Params
        } else {
            throw "Param type not supported"
        }
    }
}
```

So here all we've done is:

- add our additional parameters (Don't forget, Ensure is defined in the dscbase)
- fill out our buildparam/execute logic

Anytime we want to alter the logic or add more standard verbose messaging, we just go ahead and add it to the base class.

I know that is a lot of information and potentially a lot of new topics. However, at the same time I hope you understood what I was trying to get across.

For me this was a completely new way of looking at PowerShell and DSC. I didn't know anyone else that was working in this way and so I'm trying to spread the word.

Maybe you think I'm crazy? Maybe I am? Either way, let me know you thoughts either publically on Twitter or by mail ryan@dftai.ch

I hope this has been a useful post for you. If you are currently using PowerShell Classes, Tweet me and let me know how you've got it implemented using the hashtag #28DaysOfDSC.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
