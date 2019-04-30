---
view: post
layout: post
lang: en
author: rdbartram
title: 'the PowerShell GUI of the future III : PowerShell and...JavaScript....'
description: Creating GUIs in PowerShell is possible but how useful is it day to day
excerpt: Creating GUIs in PowerShell is possible but how useful is it day to day
cover: false
coverAlt: Illustration of the sun rising on a new day
demo: https://github.com/rdbartram/PSConfEUGUI
audio:
categories:
  - twss
tags:
  - gui
  - javascript
  - powershell
updated_at: 2017-04-20 19:00
created_at: 2017-04-20 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

JavaScript or JS is a programming language used to make static webpages interactive. Maybe you've come across it before if you are familiar with website design, there are many cool JS frameworks out there such as Angular, Vue, React etc. As I mentioned before, using something like Angular would allow you to easily run a fully functional website which by following the post would allow you to execute PowerShell on the Server hosting the Website. That is getting a little too advanced for this series of posts but if you are interested in seeing what Angular and PowerShell can do together, take a look at the [Phosphor](https://github.com/PowerShell/Phosphor) project over on Microsoft's GitHub. They are trying to automate the creation of a generic GUI for any and all PowerShell modules and scripts.

This post details how to take the PowerShell GUI, you hopefully already created following parts [1](ps-gui-future-1) and [2](ps-gui-future-2) of this series, and do the interactive bit i.e. executing PowerShell and altering the GUI as necessary.

For this example I have written 1 main "get-function" and 2 "set-functions":

- popNav - used to set the contents of the navigation bar
- popMain - used to set the contents of the main part of the window
- getSessionDays - used to gather data from the PSConfEU API

## Code

As I mentioned in [Part 1](ps-gui-future-1) there is a custom C# class that is processing all of the PowerShell being sent from the GUI. This class is added using the Add-Type CMDLet, you can see this in the main New-GUI function.

```powershell
function New-GUI {
    param(
        $xaml
    )
    try {
        $TypeDefinition = Get-Content $PSScriptRootTypeDefinition.cs -Raw

        Add-Type -TypeDefinition $TypeDefinition -ReferencedAssemblies @("System.Management.Automation", "Microsoft.CSharp", "System.Web.Extensions")

        [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework')
    }
    catch {}
    $reader = (New-Object System.Xml.XmlNodeReader ([xml]$xaml))

    $Form = [Windows.Markup.XamlReader]::Load($reader)

    return $Form
}
```

Coming to the JS, baked into the HTML file containing the entire GUI, I added a script block which contains all of the JavaScript for this project.

I wrote 3 functions popNav, popMain and getSessionDays and they work as follows

### getSessionDays

Starting off easy, getSessionDays does one thing: run PowerShell and pass the output on to popNav. The way to execute PowerShell in JavaScript is to call the runPowerShell method defined in the C# class. Since we added it as type definition to the XAML window, it can be called like so:

```javascript
window.external.runPowerShell("return 'My Cool String'", FunctionToOutput);
```

You can think of this example much like the PowerShell pipeline as they are very similar. The PowerShell equivalent would be something like this:

```javascript
'My Cool String' | FunctionToOutput;
```

In this particular case of getSessionDays, the page initially starts and the contents of the "APIFunctions.psm1" file is written in HTML to a script block with the ID PowerShellFunctions.

This script block is passed in to the runPowerShell JavaScript function, along with the function call to Get-SessionDays. The resulting HTML output is passed to popNav and the navigation bar is created.

### popNav

Moving on to the navigation bar, popNav takes an input which I've defined as result.

It finds the div with the ID Nav and sets contents with result. After doing that, it finds all the li elements (Tabs) and adds an event handler so that every time you click it, the Tab adds the active class and as a result you notice it being the active tab.

A secondary event handler is then added which runs the next function popMain.

```javascript
popNav = function(result) {
  document.getElementById('Nav').innerHTML = result;
  $('ul li').click(function() {
    $(this)
      .addClass('active')
      .siblings()
      .removeClass('active');
  });
  $('ul li a').click(function() {
    document.getElementById('Main').innerHTML =
      'http%3A%2F%2Fwww.girlsgotit.org%2Fimages%2Fajax-loader.gif';
    window.external.runPowerShell(
      script + ';Get-SessionbyDay -day ' + $(this).text(),
      popMain
    );
  });
};
```

You can think of this example much like the PowerShell pipeline because it is very similar. The PowerShell equivalent would be something like this

```javascript
function Pop-Nav ($result){
    $Global:document.getElementById("Nav").innerHTML = $result;
    Add-Eventhandler -type "ul li" -action "Set-ActiveTab $_"
    Add-Eventhandler -type "ul li a" -action "Set-MainContent"
}

function Set-ActiveTab ($Tab) {
    $Tab.AddClass("Active")
    $Tab.Siblings.foreach( {
        $_.RemoveClass("Active")
    })
}
function Set-MainContent ($Tab) {
    $Global:document.getElementById("Main").innerHTML = 'http%3A%2F%2Fwww.girlsgotit.org%2Fimages%2Fajax-loader.gif'
    Get-SessionDays -Day $Tab.Text | Pop-Main
}
```

> <lazy-load tag="img" :data="{ src: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', alt: 'spinning wheel', width:75, style:'float:left; margin: 0 15px 0 0' }" /> To improve the user experience, before the popMain is called, a loading gif is set to the Main div so the user is aware of something happening and has something nice to look at.

### popMain

The last part to the puzzle is the popMain. All the nice HTML that has been generated by Get-SessionDay -Day "Wednesday" is passed to this JavaScript function and the static code you wrote is passed to the event handlers to make it an application.

Any li (Tab) or any tr (Table Records) that get clicked will be marked as active.

The collapse up and down buttons are configured to toggle the class hidden on or off on the panel body objects.

The same effect is also applied to the panel body itself, so you can click on it and have individual panels opening and closing.

The last command \$('.panel-body').toggle("collapse"). Simply closes all the panels so the user is ready to pick his session.

## Conclusion

Hopefully you should be a bit clearer now as to how you can execute PowerShell directly from JavaScript and how it can then be linked to events such as button clicks etc.

Again, this is a relatively basic example of what can be done with HTML, JS and of course PowerShell. My hope is that you've now got a load of ideas as to how you can take these techniques and implement them into your own scripts. You are only limited by your imagination!

If you have any questions or thoughts please comment or tweet me using the hashtag #dftai [. Tweet](https://twitter.com/intent/tweet?text=#DFTAI) As of writing this I'm not really an active twitter user but I'm sure I'll get round to it ;).

I guess the last thing to say is thank you so much you for reading my first ever series of blog posts. It's something I've thought about doing for a long time now and I really do hope you found it useful. If you have suggestions for new topics, please do comment or tweet.

Until next time.

Don’t Forget To Automate It
