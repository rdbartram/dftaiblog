---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 21 Unit Testing - Follow The Red Brick Road'
description: Since they are a mixed between business logic and external function calls, we call these grey box tests, but since that would of made for a boring picture, I coloured them red 😃🎨
excerpt: Since they are a mixed between business logic and external function calls, we call these grey box tests, but since that would of made for a boring picture, I coloured them red 😃🎨
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - classes
  - pester
readtime: 9 min
created_at: 2018-02-21 08:00
updated_at: 2018-02-21 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 21! Finishing off our unit testing part of this series by covering how to mock external commands.

## Planning

Looking once last time at this diagram, all the steps marked in red are those that aren't soley comprised of code from the dftaiADUser module. Since they are a mixed between business logic and external function calls, we call these grey box tests, but since that would of made for a boring picture, I coloured them red 😃🎨.

![DSC Unit Test Plan](./images/DSCWorkUnit.png)

## Follow the Red Brick Road

Going one red brick at a time. The AssertPrerequisites method is a nice easy one to start with, it doesn't require any parameters and doesn't provide any output. In terms of mocks, it requires access to query if modules are installed or not.

Let's take a look at what that would look like.

```powershell
Describe "AssertPrerequisites" {

    $ModuleName = "ActiveDirectory"

    It "Validates that the functions response is to <Expectation> when confirming modules are available and imported" -TestCases @(
        @{Available = $true; Expectation = "Throw"}
        @{Available = $false; Expectation = "NotThrow"}
    ) {
        param ($Available, $Expectation)

        $be = @{"Throw" = $true}

        if ($Available) {
            mock Get-Module -ParameterFilter {$Name -eq $ModuleName} -MockWith {
                return [PSCustomObject]@{Name = $ModuleName}
            }

            mock Import-Module -ParameterFilter {$Name -eq $ModuleName} -MockWith {}

            $Be.Add("Not", $true)

            $InstallCalls = 1
        } else {
            mock Get-Module -ParameterFilter {$Name -eq $ModuleName} -MockWith {}
            $InstallCalls = 0
        }

        {[dftaiADUser]::AssertPrerequisites()} | Should @be

        Assert-MockCalled Import-Module -Times $InstallCalls -Exactly -ParameterFilter {$Name -eq $ModuleName} -Scope It
    }
}
```

So here I introduce the concept of mocking. What this means is to take an existing function i.e. Get-Module and make it do what we want it to do, in our case, pretend a module is available or not.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />**BEWARE!** Since the mocks are altering commands in the current PowerShell session, unless the commands are necessary directly in the test script, you should declare that the tests are executed in the scope of the module.

You can do this by wrapping the relevant context, describe etc with the InModuleScope keyword like so.

```powershell
InModuleScope -ModuleName dftaiADUser {

}
```

The other interesting command here is Assert-MockCalled. It allows you to check that the mock you created was in fact used. I've implemented it here to check my if logic and confirm that the Install-Module command isn't actually run when the module isn't available.

Brick 2,3,4

Looking at the next 3 steps, the logic is 99% the same. Its a case of preparing the parameters hashtable to pass to either the get, add or remove commands, executing and determining if the mocks were appropriately called.

With the exception of the ExecuteGet, all the method is is a wrapper for the external function. We can test the function is called with the correct parameters and tha if the input parameter isn't a hashtable, then throw an exception.

With regard the exception though, the following test checks not only that the mock was called using the Assert-VerifiableMock (which works similar to Assert-MockCalled differing only in that it doesn't care for the number of times. Simply, have all mocks marked Verifiable been run?) rather, that the Output type is as it should be and the properties values are what I expect.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />**BEWARE!** For the same reason I had to create the DTO yesterday, I've had to create the AD function here in the test script. This is so that should the module not be installed, the Mock can be successfully created.

The following 3 Tests consist or 2 use cases. One where the Runas credential is specified and another where it isn't.

Think about using -TestCases to reuse your "It" blocks when all you're doing is testing variations of the same test.

```powershell
Describe "ExecuteGet" {

    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred
    function Get-ADUser {
        param(
            $Filter,
            $Credential
        )
    }

    It "Executes Get against Mocked ADUser command <additionaltext>" -TestCases @(
        @{ClassInstance = $UsernamePassword; additionaltext = ""}
        @{ClassInstance = $UsernamePasswordCredential; additionaltext = "with credential parameter"}
    ) {
        param ($ClassInstance)

        $Params = @{
            Filter = "SamAccountName -eq '$Username'"
        }

        if ($ClassInstance.DomainAdministratorCredential) {
            $Params.Add("Credential", $ClassInstance.DomainAdministratorCredential)
        }

        Mock Get-ADUser -ParameterFilter {$Filter -match $Username} -Verifiable {
            [pscustomobject]@{
                SamAccountName = $Username
                ObjectGuid     = [guid]::NewGuid()
            }
        }

        {$Script:Output = $ClassInstance.ExecuteGet($Params)} | Should -Not -Throw

        $Script:Output.GetType().Name | Should -Be "ADUserDTO"
        $Script:Output.SamAccountName | Should -Be $Username

        Assert-VerifiableMock
    }

    It "Throw exception when input object is not of type Hashtable" {

        $Params = [pscustomobject]@{Test = "test"}

        {$UsernamePassword.ExecuteGet($Params)} | Should -Throw -ExpectedMessage "Param type not supported"
    }
}
```

Again, not too much to say here. The same two use cases, with and without a runas credential. However, these two methods, ExecuteAdd and ExecuteRemove are voids and so don't require any testing of the output. The only valid tests here are, did the mock run? and does it throw an exception when the input parameter isn't a hashtable.

![Dude, Stop!](https://media.giphy.com/media/3o7TKzcgjzbWyWWlJS/giphy.gif)

Maybe it would be a good test at this point to stop reading and see if you could write the final two tests by yourself!

Once you've done it, check back and see how it compares to the code below.

```powershell
Describe "ExecuteAdd" {

    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred
    function New-ADUser {
        param(
            $Name,
            $AccountPassword,
            $Credential
        )
    }

    It "Executes Add against Mocked ADUser command <additionaltext>" -TestCases @(
        @{ClassInstance = $UsernamePassword; additionaltext = ""}
        @{ClassInstance = $UsernamePasswordCredential; additionaltext = "with credential parameter"}
    ) {
        param ($ClassInstance)

        $Params = @{
            Name            = $Username
            AccountPassword = $Password
        }

        if ($ClassInstance.DomainAdministratorCredential) {
            $Params.Add("Credential", $ClassInstance.DomainAdministratorCredential)
        }

        Mock New-ADUser -ParameterFilter {$Name -eq $Username -and $AccountPassword -eq $Password} -Verifiable {
        }

        {$ClassInstance.ExecuteAdd($Params)} | Should -Not -Throw

        Assert-VerifiableMock
    }

    It "Throw exception when input object is not of type Hashtable" {

        $Params = [pscustomobject]@{Test = "test"}

        {$UsernamePassword.ExecuteAdd($Params)} | Should -Throw -ExpectedMessage "Param type not supported"
    }
}

Describe "ExecuteRemove" {

    $UsernamePassword = [dftaiADUser]::New($Username, $Password)

    $UsernamePasswordCredential = [dftaiADUser]::New($Username, $Password)
    $UsernamePasswordCredential.DomainAdministratorCredential = $RunAsCred
    function Remove-ADUser {
        param(
            $Identity,
            $Credential
        )
    }

    It "Executes Remove against Mocked ADUser command <additionaltext>" -TestCases @(
        @{ClassInstance = $UsernamePassword; additionaltext = ""}
        @{ClassInstance = $UsernamePasswordCredential; additionaltext = "with credential parameter"}
    ) {
        param ($ClassInstance)

        $Params = @{
            Identity = $Username
        }

        if ($ClassInstance.DomainAdministratorCredential) {
            $Params.Add("Credential", $ClassInstance.DomainAdministratorCredential)
        }

        Mock Remove-ADUser -ParameterFilter {$Identity -eq $Username} -Verifiable {
        }

        {$ClassInstance.ExecuteRemove($Params)} | Should -Not -Throw

        Assert-VerifiableMock
    }

    It "Throw exception when input object is not of type Hashtable" {

        $Params = [pscustomobject]@{Test = "test"}

        {$UsernamePassword.ExecuteRemove($Params)} | Should -Throw -ExpectedMessage "Param type not supported"
    }
}
```

At the end of the day, we can only confirm this works 100% by running an integration test against the real AD.

And this is point where you want to be...all of your code is tested and working, any functions that exist separate from your module are what they are. Meaning that we are as sure as we can be that the code we've written will perform as expected when deployed into the real world.

Again, super easy right? I said it yesterday, but when you have all your logic nicely encapsulated, especially externally calls, your tests become infinitely easier to write. The mocks are there so you can emulate a call to an external function and confirm that the input you should be providing is good and also that you are processing the output correctly.

If you managed to write those last 2 test by yourself then congrats! You've come along way since the 1st of February.

Consider now trying to write an end to end test. I explicitly left out testing the get, set and test DSC methods hoping that you could try it yourselves and on the 28th I can make mine available for you to compare against.

I hope these last 3 posts were useful to get you started on your unit testing journey.

This is the last Wednesday of 28 Days of DSC, thanks a lot for supporting the series and lets have a good last week!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
