---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 9 Script Based Resource Part 2'
description: The script resource, its a nasty thing. But you need to know what it is and how it works.
excerpt: The script resource, its a nasty thing. But you need to know what it is and how it works.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - resource
  - script resource
readtime: 18 min
created_at: 2018-02-09 08:00
updated_at: 2018-02-09 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 9 of 28 signals the next part of the script based resource tutorial.

We used the xDSCResourceDesigner to create a dftaiADUser resource and now we need only fill in the contents.

When doing any sort of development it's important to have a plan about how you want to achieve your goal. Here is quick diagram of how the code should flow. This isn't necessary but it makes things easier going forward.

![DSC Workflow]/./images/DSC-Workflow.png)

## The Get

So working from left to right, let's going down the list and start writing our code.

As you can see the Get is split up into separate "functions".

### 1. Assert prerequisites

What this means is, "Is the Active Directory module installed and imported?". Splitting it like this makes it easy to unit test at a later stage. The function looks like this.

```powershell
function Assert-Prerequisites {
    if(Get-Module ActiveDirectory -ListAvailable) {
        Import-Module ActiveDirectory
    } else {
        Throw "ActiveDirectory Module is not installed"
    }
}
```

### 2. Build Get Parameters

What this refers to is getting the appropriate parameters ready to call the Get-ADUser command. Again doing this removes any business logic from your main functions and means it easier to read for anyone needing to maintain your code later.

```powershell
function New-GetADUserParameters  {
    params(
        [parameter(Mandatory, ValueFromPipeline)]
        [Hashtable]
        $ParameterToProcess
    )

    $ReturnObject = @{}

    $Filter = @()
    if($ParameterToProcess.ContainsKey("Username")) {
        $Filter += "SAMAccountName -eq= '$Username'"
    }

    if($ParameterToProcess.ContainsKey("DomainAdministratorCredential")) {
        $ReturnObject.Add("Credential", $DomainAdministratorCredential)
    }

    if($Filter.Count -gt 0) {
        $ReturnObject.Add("Filter", $Filter -join ' -and ')
    }

    $ReturnObject
}
```

### 3. Get AD User

Self explanatory, but execute the Get-ADUser command using with the predefined parameters

```powershell
$GetADUserParams = New-GetADUserParameters -ParameterToProcess $PSBoundParameters

$ADUser = Get-ADUser @GetADUserParams -ErrorAction SilentlyContinue
```

It would be better if you could abstract the Get-ADUser command in order to handle specific errors such as user not found, no network connection, invalid credentials etc. I've just said ignore any errors and the Ensure state in that case would be "Absent".

### 4. Build dftaiADUser Return Object

This is a similar process to step 2 but in the inverse if you will. It means that somebody requesting this configuration can see what the current state is. In our example, the only piece of useful information is the Ensure property.

Beware, in the case when credentials are passed, you do not want to give those back from your Get function. Otherwise they are available to anyone who has access to DSC on the node.

Also, Key parameters i.e. Username can/should be returned as they were provided. That way it's easy to identify how the object should have been.

```powershell
function New-dftaiADUserReturnObject {
    param(
        [parameter(Mandatory, ValueFromPipeline)]
        [AllowNull()]
        $ADUserObject,

        [parameter(Mandatory)]
        [Hashtable]
        $DSCParameters
    )

    $Ensure = "Present"

    if(!$ADUserObject) {
        $Ensure = "Absent"
    }

    @{
        Username = $DSCParameters.Username
        Password = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
        DomainAdministratorCredential = New-Object PSCredential -ArgumentList 'FakeCredential', (ConvertTo-SecureString 'FakePassword' -AsPlainText -Force)
        Ensure = $Ensure
    }
}
```

In the end our get looks like this

```powershell
Assert-Prerequisites

$GetADUserParams = New-GetADUserParameters -ParameterToProcess $PSBoundParameters

$ADUser = Get-ADUser @GetADUserParams -ErrorAction SilentlyContinue

$ReturnObject = $ADUser | New-dftaiADUserReturnObject

$ReturnObject
```

Looks nice and tidy right? Sure I could make the code shorter, but less is not always more. This way I think is the most clear for a external person to read.

One function down...2 to go.

## The Test

The Test command is the command that runs most often on your machine, therefore it should be as small and as unobtrusive as possible. By default, the LCM does a consistency check every 15 minutes. So if you have some heavy code that requires a lot of resources, then your server, server admins and users are not going to thank you.

The Test, if it wasn't obvious already is responsible for determining if the set will run or not. Depending on your circumstance that may mean you need to query every possible option to see if it is set correctly. Or it could mean to check if the object exists.

For our example we are going to only check if the user is present, not if the password is set correctly. The reason is two-fold. One it puts an unnecessary load on your DCs to handle these requests. 1 user may be fine, but if you are deploy 10,000 users and DSC is checking every 15 mins... and two, it means DSC becomes responsible for setting the password. If the user or anybody changes the password DSC will either lock the account out because it is continually testing if the password is valid or it will reset the password and the user won't be able to log back on again.

Hence, think through which properties are important to set? sure. But which are important to check afterwards?

The Test logic in our example is split into 2 parts. First run our Get command.

```powershell
$CurrentState = Get-TargetResource @PSBoundParameters
```

Now we need a validate function. See we use a loop to check whether Ensure and Username are set correctly, if not, we write out the problem to with a verbose message and return false.

```powershell
function Validate-dftaiADUser {
    param(
        [parameter(Mandatory, ValueFromPipeline)]
        $dftaiADUserObject,

        [parameter(Mandatory)]
        [Hashtable]
        $DSCParameters
    )

    $IsValid = $true

    @("Ensure", "Username") | Foreach {
        if($dftaiADUserObject.$_ -ne $DSCParameters.$_) {
            Write-Verbose ("State of {0} does not match desired state" -f $_)
            $IsValid = $false
        }
    }

    $IsValid
}
```

In the end our test look like this

```powershell
$CurrentState = Get-TargetResource @PSBoundParameters

Validate-dftaiADUser -dftaiADUserObject $CurrentState -DSCParameters $PSBoundParameters
```

## The Set

This part is the part I would say you are all most familiar with. This is the straight up do something block.

The only thing you need to try and do is write a function that always returns the same answer. i.e. don't +1 in your set.
Or more practically don't add a disk to a vm, don't increase a users mailbox by 5gb.

Unless that is really what you want, be aware that every time DSC runs its set it will increase the number of disks by 1 or increase the users mailbox by 5gb, even if it only was that you wanted to set a tag on a vm or add an SMTP address to the mailbox.

What I'm trying to say is, try to declare specifically what you want i.e. users mailbox should be 10gb or VM should have disk with ID 3.

It really just depends on how your resource is written.

For the mailbox case, if you're state was mailbox should not be more than 90% full. Then of course increase by 5gb everytime.

DSC is a powerful tool, but it can bite you if your code is used to running only once and DSC runs it over and over again.

To the code,

1. Assert prerequisites
   Ahh! We already wrote that, a job saved.

2. Get Current State
   We wrote that already too!

3a. If currently doesn't exist and should, create - Build New-ADUser Params

This is very similar to that what we did in the get, just customised to our needs for creating a user.

```powershell
function New-NewADUserParameters  {
    params(
        [parameter(Mandatory, ValueFromPipeline)]
        [Hashtable]
        $ParameterToProcess
    )

    $ReturnObject = @{}

    if($ParameterToProcess.ContainsKey("Username")) {
        $ReturnObject.Add("Name", $Username)
    }

    if($ParameterToProcess.ContainsKey("Password")) {
        $ReturnObject.Add("AccountPassword", $Password)
    }

    if($ParameterToProcess.ContainsKey("DomainAdministratorCredential")) {
        $ReturnObject.Add("Credential", $DomainAdministratorCredential)
    }

    $ReturnObject
}
```

Now all we have that we call New-ADUser.

3b. if currently does exist and shouldn't, then remove

```powershell
function New-RemoveADUserParameters  {
    params(
        [parameter(Mandatory, ValueFromPipeline)]
        [Hashtable]
        $ParameterToProcess
    )

    $ReturnObject = @{}

    if($ParameterToProcess.ContainsKey("DomainAdministratorCredential")) {
        $ReturnObject.Add("Credential", $DomainAdministratorCredential)
    }

    $ReturnObject
}

$RemoveParams = New-RemoveADUserParameters -ParameterToProcess $PSBoundParameters

$ADUser | Remove-ADUser @RemoveParams
```

I can see some of you saying now, why have a whole function just to return the DomainAdministratorCredential.

The reason is that it is easier to extend at a later stage. Say I need to target a particular DC when removing because my closest is a RODC.

And in any case, to build logic into the set which checks in the DomainAdministratorCredential has been included or not is almost the same amount of effort. Only this way is also, unit testable ;).

So in the end our entire Set looks like this

```powershell
Assert-Prerequisites

$GetADUserParams = New-GetADUserParameters -ParameterToProcess $PSBoundParameters

$ADUser = Get-ADUser @GetADUserParams -ErrorAction SilentlyContinue

if($Ensure -eq "Present") {
    $NewParams = New-NewADUserParameters -ParameterToProcess $PSBoundParameters

    if(!$ADUser) {
        $ADUser = New-ADUser @NewParams
    }

    #Here would go the Update logic
}

If($Ensure -eq "Absent") {
    $RemoveParams = New-RemoveADUserParameters -ParameterToProcess $PSBoundParameters

    $ADUser | Remove-ADUser @RemoveParams
}
```

So I hope this has been a good clean example of how you plan and implement a DSC Script Resource from scratch. If you do have any questions either Twitter or email me ryan@dftai.ch

Ok guys, thanks for hanging in there. I know there was a lot of coding today, but now I would say you are officially level 1 certified! :D

There is a lot more to learn, so hope to see you back here same time, same place!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
