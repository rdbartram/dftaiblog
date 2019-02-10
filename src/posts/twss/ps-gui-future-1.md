---
view: post
layout: post
lang: en
author: rdbartram
title: "the PowerShell GUI of the future I : Dawn Of A New Day"
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
  - powershell
created_at: 2017-04-08 19:00
updated_at: 2017-04-08 19:00

meta:
  - property: og:image
    content: /share/dftai-image-share.png
  - name: twitter:image
    content: /share/dftai-image-share.png
---

So I was looking at the [PSConf EU](http://www.psconf.eu/) webpage, deciding whether I should go or not, when I saw that there was a challenge to take the data from the conference agenda and wrap it in a PowerShell GUI. I have written GUIs before using XAML, but I just didn't like how unreadable they were. XAML isn't as broadly known as some other markup languages (foreshadowing) and having to hook up all the event handlers in PowerShell was just something that made me say eeeeeee!!!

I expect you have already seen many different blog posts on PowerShell GUIs. My hope is that from this mini series you might be able to understand a bit better how you could implement this in the real world, rather than it being purely conceptual. Also, I want to be as simple as possible with my explanations, so perhaps you may understand this better than others.

Last couple of things before I get going. As I said, this is a series, you can find the other 2 parts here:
*  [Part II - HTML and CSS](ps-gui-future-2)
*  [Part III - PowerShell...and JavaScript...](ps-gui-future-3)

All the code can be found clicking on the demo link at the top of this post. Also, when looking initially into how exactly I could do this, Micah Rairdon and his blog [Tiberriver256](http://tiberriver256.github.io) proved to be very useful. In fact it's almost plagiarism.

## Concept

So basically the idea here is as follows:

*   create a very basic WPF Form with a Web Browser control
*   take a single page HTML app and drop it in the browser
*   use JavaScript to execute functions imported from the PowerShell module

## Code

### Create Form

So to create the form I'm keeping the XAML (unfortunately), to prevent the need to create a web server in PowerShell and respond to http requests. This is entirely possible and potentially would make it more portable as I believe this would then work on Linux and Mac variants of PowerShell. Perhaps in the future I can write a series on doing that. The XAML is simple, containing just a WebBrowser control called WebBrowser which we can reference later.

```html
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" Title="$Title" Height="500" Width="700">
    <Grid>
        <DockPanel>
            <WebBrowser Name="WebBrowser" DockPanel.Dock="Top" Margin="30"></WebBrowser>
        </DockPanel>
    </Grid>
</Window>
```

Then to create the form I wrote a small function which returns the form as an object.

This involes importing a custom C# class<details><summary>C# explanation for those who care</summary>So the magic behind being able to call PowerShell from JavaScript lies in a series of methods defined in C# which are then imported as type definitions. I will explain it in more detail in [Part III](ps-gui-future-3). There is one public method called runPowershell. This runs asynchronously and basically executes any text you pass it as if it were run in an actual PowerShell console.

```csharp
using System;
using System.Collections.ObjectModel;
using System.Management.Automation;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Text;

[ComVisible(true)]

public class PowerShellHelper {

    void InvokePowerShell(string cmd, dynamic callbackFunc) {
        using (PowerShell PowerShellInstance = PowerShell.Create()) {
            PowerShellInstance.AddScript(cmd);

            Collection<PSObject> results = PowerShellInstance.Invoke();

            //Convert records to strings
            StringBuilder stringBuilder = new StringBuilder();
            if (PowerShellInstance.HadErrors) {
                foreach(var errorRecord in PowerShellInstance.Streams.Error) {
                    stringBuilder.Append(errorRecord.ToString());
                }
            } else {
                foreach(PSObject obj in results) {
                    stringBuilder.Append(obj);
                }
            }
            callbackFunc(stringBuilder.ToString());
        }
    }

    public void runPowerShell(string cmd, dynamic callbackFunc) {
        new Task(() => { InvokePowerShell(cmd, callbackFunc); }).Start();
    }
}
```
</details>
</br>
Importing the WPF Assemblies and returning a XamlReader based on the XAML passed in the variable.

```powershell
function New-GUI {
    param(
        $xaml
    )
    try {
        $TypeDefinition = Get-Content $PSScriptRoot\TypeDefinition.cs -Raw

        Add-Type -TypeDefinition $TypeDefinition -ReferencedAssemblies @("System.Management.Automation", "Microsoft.CSharp", "System.Web.Extensions")

        [void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework')
    }
    catch {}
    $reader = (New-Object System.Xml.XmlNodeReader ([xml]$xaml))

    $Form = [Windows.Markup.XamlReader]::Load($reader)

    return $Form
}
```

After that form can be shown by calling the ShowDialog() method on the XamlReader object($Form).

### Putting it together

So now all the code has been written, there is nothing more to do than to run it.

```powershell
$Form = New-GUI -XAML (Get-Content .\form.xaml -Raw)
$Form.ShowDialog()
```

If you liked this post, please share it on social media with the hashtag #dftai. I guess the last thing to say is I appreciate you reading this. and Don't Forget To Automate It
