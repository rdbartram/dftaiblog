---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 19 Unit Testing - The Begins of Pester'
description: For help debugging an troubleshooting DSC configurations and resources.
excerpt: For help debugging an troubleshooting DSC configurations and resources.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - pester
readtime: 8 min
created_at: 2018-02-19 08:00
updated_at: 2018-02-19 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 19! Monday morning and hopefully your all raring to go. As I mentioned yesterday, the next couple of posts are going to be focused on how we take all the code we've written up until this point and automatically test to see that it's working as expected.

Today's post is going to be mostly on getting Pester setup for basic tests and then tomorrow we'll see if we can get some more complex tests set up and running.

## Pester

When you talk about testing and PowerShell, Pester is the name that comes to mind. It's an open source [project](https://github.com/pester/Pester) on GitHub which provides all the functions you could possibly want from a testing framework: isolation, mocking, integration into the build pipeline. The list goes on.

It's very easy to install from the PowerShell gallery using the following command. You literally need nothing else to get up and running.

```powershell
Install-Module Pester
```

Since it's all written in PowerShell, it's nice and easy for beginners to get started; it's just like writing any other script.

Lets take our Validate-dftaiADUser function from day 9. We pass it two parameters and it check that the username and ensure parameters match on both objects.

```powershell
Describe "Validate-dftaiADUser" {

    $PresentADUser = @{
        Ensure   = "Present"
        Username = "Ryan"
    }

    $AbsentADUser = $PresentADUser.Clone()
    $AbsentADUser.Ensure = "Absent"

    It "Validates dftai user and returns false since present and absent don't match" {
        Validate-dftaiADUser $PresentADUser $AbsentADUser | Should -BeFalse
    }
}
```

The syntax is very human readable. You can see I am testing/"Describing" the Validate-dftaiADUser function, then defining that "It" "Should" "be false" since the Ensure properties of $PresentADUser and $AbsentADUser don't match. Extensive details on the available switches after Should can be found on the GitHub [wiki](https://github.com/pester/Pester/wiki/Should) page.

Ok, that example is a little less complex than average for this series (People have mentioned I don't like to use clichéd examples. But by now I think we're all well on our way to understanding my code ramblings).

If you feel like taking it up a notch, here's a slightly more variable version in switch I use some of the newer features of v4 including TestCases and Because.

```powershell
Describe "Validate-dftaiADUser" {

    $PresentADUser = @{
        Ensure   = "Present"
        Username = "Ryan"
    }

    $AbsentADUser = $PresentADUser.Clone()
    $AbsentADUser.Ensure = "Absent"

    It "Validates dftai user when its return value should be <expectation>" -TestCases @(
    @{adobject = $PresentADUser; TestObject = $PresentADUser; Expectation = $true}
    @{adobject = $AbsentADUser; TestObject = $PresentADUser; Expectation = $false}
    ) {
        param ($adobject, $TestObject, $Expectation)

        $be = @{"Be$Expectation" = $true}

        Validate-dftaiADUser $adobject $TestObject | Should @Be -Because "Username and Ensure parameters should match those from the testobject"
    }
}
```

The TestCases is a nice parameter which allows you to test a whole dataset instead of just a single piece of data. It can easily be that the function works in one case but not another. This parameter just compacts the code and allows for easy code reuse.

The Because parameter is something new in v4.2.0, it just adds a bit more to the tests to make them more readable. It is visible of course in the code and as well in the output should the test fail.

Note, that what made this test so easy to write was the fact that the function only does one job. I've tried to demonstrate this concept throughout all the examples I've provided.

Separation of responsibility in code is essential if you want the code to be 1. readable 2. easy to test 3. easy to modify and use elsewhere.

Having these 3 things means that the code you write is less likely to live a short life in your script, rather it gets used over and over again, being updated when necessary but maintaining its value much longer.

Tomorrow I'm going to go through the class based example from last week and show you guys how to automate each component. Once we have all the unit tests down, we can move onto mocking the connections to AD and running integration tests over the whole DSC Resource.

Hopefully that's interesting for you guys 🙂.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
