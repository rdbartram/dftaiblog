---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 20 Unit Testing - Follow The Yellow Brick Road'
description: For help debugging an troubleshooting DSC configurations and resources.
excerpt: For help debugging an troubleshooting DSC configurations and resources.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
  - pester
readtime: 15 min
created_at: 2018-02-20 08:00
updated_at: 2018-02-20 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 20! and a continuation of the unit testing story we began yesterday. Since we covered Classes last week and those posts were well received, I'll demonstrate the rest of the Pester tests on that DSC Class.

## Planning

At the end of the day the better you plan, the easier it is to implement these tests.

Going back to the diagram I showed you way back when, you can see I've altered it a little.

All of the steps marked in yellow are steps that can be unit tested, 100% logic only tests.

The red steps are those that require mocks. This is because they rely on logic that lies outside of that particular functions control i.e. running the command Get-ADUser.

![DSC Unit Test Plan](./images/DSCWorkUnit.png)

## Follow the Yellow Brick Road

So lets tackle one yellow brick at a time. Starting off easy, the BuildGetParams method requires you define in advance what your inputs and output are going to be.

In this case the output should be a hashtable which later will be splated onto Get-ADUser.

```powershell
Describe "BuildGetParams" {

    $Username = "Ryan"
    $Password = New-Object PSCredential -ArgumentList $Username, (ConvertTo-SecureString 'Password' -AsPlainText -Force)
    $RunAsCred = New-Object PSCredential -ArgumentList 'DFTAI\Administrator', (ConvertTo-SecureString 'Password' -AsPlainText -Force)

    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred

    It "Returns a hashtable with the necessary keys: <Keys>" -TestCases @(
        @{ClassInstance = $UsernamePassword; Keys = "Filter"}
        @{ClassInstance = $UsernamePasswordCredential; Keys = "Filter,Credential"}
    ) {
        param ($ClassInstance, $Keys)

        $Output = $ClassInstance.BuildGetParams()

        $Output | Should -BeOfType hashtable

        $Keys.split(",") | % {
            $Output.ContainsKey($_) | Should -BeTrue -Because "the output should have a key called $_"
        }

        $Output.Filter | Should -Be "SAMAccountName -eq= '$($ClassInstance.Username)'"
    }
}
```

Here I've built the test inputs as UsernamePassword and UsernamePasswordCredential, the difference being that the latter passes a run as credential.

Then I check a couple of things, firstly, is the output a hashtable. Second, are all the keys present in the output. Finally, I check that the filter has been correctly created.

If something were to go wrong, say an additional key was expected but not found. This is what would happen.

![unit test failed](./images/unitfailed.png)

You can see the new -Because parameter makes the output a bit easier to read. Potentially making someone else's or your own life easier when testing your code.

Brick number 2, building the return object from the Get method. Since we are using classes, this can be easily achieved by creating a new constructor for our class.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />**BEWARE!** I noticed are looking back at my code that I was returning the Microsoft.ActiveDirectory.Management.ADUser class from my ExecuteGet command and passing it to my constructor. This was bad as it made it impossible to unit test the constructor. I've learnt from my mistake and created a DTO instead, see below.

Testing the constructor and checking its output it almost identical to that of the previous example.

```powershell
class ADUserDTO {
    [string] $GivenName

    [string] $Surname

    [string] $UserPrincipalName

    [bool] $Enabled

    [string] $SamAccountName

    [System.Security.Principal.SecurityIdentifier] $SID

    [string] $DistinguishedName

    [string] $Name

    [string] $ObjectClass

    [AllowNull()]
    [guid] $ObjectGuid
}
```

Here the DTO (Data Transfer Object) is a simple class which has properties similar to that of the real Microsoft.ActiveDirectory.Management.ADUser class. I can create it in my unit test and pass it to my dftaiADUser constructor to as I would any other method.

In the ExecuteGet method, I would simply create a copy of the DTO and return it filled with the properties from the Get-ADUser command (more on that tomorrow).

```powershell
Describe "Constructor which accepts ADUserDTO" {
    $DTO = [ADUserDTO]::New()

    $DTO.SamAccountName = $Username

    It "Returns a dftaiADUser Class with generalised passwords" {
        $dftaiaduser = [dftaiADUser]::New($DTO)

        $dftaiaduser.GetType().Name | Should -be "dftaiADUser"
        $dftaiaduser.Password.GetNetworkCredential().Password | Should -Be "FakePassword" -Because "the real password shouldn't be returned"
    }
}
```

Not too much to say here. Two checks, 1. is the type dftaADUser.

Since, dftaiADUser isn't recoginised by Pester as a type for some reason, I had to pull out the name separately and match the string...Not Cool!

The second check is just to check that the password has been generalised and isn't that what was provided to the resource.

Brick 3, Validate Current state. In the class resource its the Equals method that we need to test. Again an easy test, two use cases, one where the Ensure parameter matches and one where it doesn't.

```powershell
Describe "Equals" {
    $desiredState = [dftaiADUser]::New($Username, $Password)

    $presentaduser = [dftaiADUser]::New($Username, $Password)

    $Absentaduser = [dftaiADUser]::New($Username, $Password)
    $Absentaduser.Ensure = [Ensure]::Absent

    It "Returns <Expectation> depending if desired state matches or not" -TestCases @(
        @{desiredstate = $desiredstate; currentstate = $presentaduser; Expectation = $true}
        @{desiredstate = $desiredstate; currentstate = $Absentaduser; Expectation = $false}
    ) {
        param ($desiredstate, $currentstate, $Expectation)

        $Be = @{"Be$Expectation" = $true}

        $desiredState.Equals($currentstate) | Should @Be
    }
}
```

The final two bricks are so similar to brick 1 that we can almost use the same test for all three. Here is are the test for BuildAddParams and BuildRemoveParams. Just a couple of small changes.

```powershell
Describe "BuildAddParams" {
    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred

    It "Returns a hashtable with the necessary keys: <Keys>" -TestCases @(
        @{ClassInstance = $UsernamePassword; Keys = "Name,AccountPassword"}
        @{ClassInstance = $UsernamePasswordCredential; Keys = "Name,AccountPassword,Credential"}
    ) {
        param ($ClassInstance, $Keys)

        $Output = $ClassInstance.BuildAddParams()

        $Output | Should -BeOfType hashtable

        $Keys.split(",") | % {
            $Output.ContainsKey($_) | Should -BeTrue -Because "the output should have a key called $_"
        }

        $Output.Name | Should -Be $ClassInstance.Username
        $Output.AccountPassword | Should -Be $ClassInstance.Password

        if($ClassInstance.DomainAdministratorCredential){
            $Output.Credential | Should -Be $ClassInstance.DomainAdministratorCredential
        }
    }
}

Describe "BuildRemoveParams" {
    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred

    It "Returns a hashtable with the necessary keys: <Keys>" -TestCases @(
        @{ClassInstance = $UsernamePassword; Keys = "Identity"}
        @{ClassInstance = $UsernamePasswordCredential; Keys = "Identity,Credential"}
    ) {
        param ($ClassInstance, $Keys)

        $Output = $ClassInstance.BuildRemoveParams()

        $Output | Should -BeOfType hashtable

        $Keys.split(",") | % {
            $Output.ContainsKey($_) | Should -BeTrue -Because "the output should have a key called $_"
        }

        $Output.Identity | Should -Be $ClassInstance.Username

        if($ClassInstance.DomainAdministratorCredential){
            $Output.Credential | Should -Be $ClassInstance.DomainAdministratorCredential
        }
    }
}
```

Super easy right? When you have all your logic nicely encapsulated, your tests become infinitely easier to write. Using the DTO Class is not something I have seen used in Pester testing before, even Microsoft's "x" Modules rely on the module being available (at least in the modules I've worked on).

Tomorrow we will finish off testing our class based resource by following the red brick road.

Mocking is something that pushes a lot of people away from unit testing. I'm here to show you that if you do it right then unit testing and mocking truly aren't that difficult.

I hope this has all been new and useful information for you.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
