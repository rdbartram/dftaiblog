---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 3 Basic Troubleshooting - Job Logs'
description: For help debugging an troubleshooting DSC configurations and resources.
excerpt: For help debugging an troubleshooting DSC configurations and resources.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - troubleshooting
readtime: 9 min
created_at: 2018-02-03 08:00
updated_at: 2018-02-03 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Back again for another 28 Days of DSC post. I'm still refining the order in which I want to post these out. Later on next week I think posts will start coming in for developing custom resources, so look forward to that. For now, lets concentrate on confirming that what we currently have, is working how it should.

There are various different methods of getting access to the DSC job logs, through the Windows Event Log, direct from the log file on disk, using the xDscDiagnostics PowerShell module or from the DSC Compliance Server.

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />For the SCOM enthusiasts among you, [here](http://bit.ly/dscscom) is cool blog post by Bruno Saille @ Microsoft about how dsc nodes can be discovered and monitored with a custom MP.
&nbsp;
&nbsp;

Again, since I don't want to just type up everything if it's already been done, head over to [docs.microsoft.com](https://docs.microsoft.com/en-us/powershell/dsc/troubleshooting) for a good set of instructions on how to troubleshoot using the Event Log and the xDscDiagnostics Resource.

However, there are a few ways we can automate some of the steps they have documented and what is if the Event Logs haven't been activated and the xDscDiagnostics module isn't available?

## Enabling Event Logs using xDscDiagnostics
Enabling the Event Logs with the xDscDiagnostics module is as easy 1,2,3

```powershell
@(
    #1
    "Analytic",
    #2
    "Debug",
    #3
    "Operational",
) | % { Update-xDscEventLogStatus -Channel $_ -Status "Enabled" }
```

Unfortunately there isn't a DSC Resource for this right now but maybe we can create that in a later post.

## Get-DSCConfigurationStatus command
Using Get-DSCConfigurationStatus returns a summary of the last job's details. Using -All returns then all the logs available.

![Get DSC Status](./images/dscstatus.png)

The useful properties in this output are ResourcesInDesiredState, ResourcesNotInDesiredState, Success, Error.

The ResourcesIn and NotInDesiredState object look like this. In this particular case we can see that the error is a json object and occurred because the Registry Key I was trying to set didn't exist.

```powershell
ConfigurationName    : SpectreFix
DependsOn            :
ModuleName           : PSDesiredStateConfiguration
ModuleVersion        : 1.1
PsDscRunAsCredential :
ResourceId           : [Registry]MinVmVersionForCpuBasedMitigations
SourceInfo           : ::22::9::Registry
DurationInSeconds    : 0.169
Error                : {
                           "Exception":  {
                                             "Message":  "PowerShell DSC resource MSFT_RegistryResource  failed to
                       execute Test-TargetResource functionality with error message: (ERROR) Invalid registry hive was
                       specified in registry key \u0027HKLM\\SOFTWARE\\Microsoft\\Windows
                       NT\\CurrentVersion\\Virtualization\u0027 ",
                                             "Data":  {

                                                      },
                                             "InnerException":  {
                                                                    "ErrorRecord":  "(ERROR) Invalid registry hive was
                       specified in registry key \u0027HKLM\\SOFTWARE\\Microsoft\\Windows
                       NT\\CurrentVersion\\Virtualization\u0027",
                                                                    "WasThrownFromThrowStatement":  true,
                                                                    "Message":  "(ERROR) Invalid registry hive was
                       specified in registry key \u0027HKLM\\SOFTWARE\\Microsoft\\Windows
                       NT\\CurrentVersion\\Virtualization\u0027",
                                                                    "Data":
                       "System.Collections.ListDictionaryInternal",
                                                                    "InnerException":  "System.ArgumentException:
                       (ERROR) Invalid registry hive was specified in registry key
                       \u0027HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Virtualization\u0027",
                                                                    "TargetSite":
                       "System.Collections.ObjectModel.Collection`1[System.Management.Automation.PSObject]
                       Invoke(System.Collections.IEnumerable)",
                                                                    "StackTrace":  "   at
                       System.Management.Automation.Runspaces.PipelineBase.Invoke(IEnumerable input)\r\n   at
                       System.Management.Automation.PowerShell.Worker.ConstructPipelineAndDoWork(Runspace rs, Boolean
                       performSyncInvoke)\r\n   at
                       System.Management.Automation.PowerShell.Worker.CreateRunspaceIfNeededAndDoWork(Runspace
                       rsToUse, Boolean isSync)\r\n   at
                       System.Management.Automation.PowerShell.CoreInvokeHelper[TInput,TOutput](PSDataCollection`1
                       input, PSDataCollection`1 output, PSInvocationSettings settings)\r\n   at
                       System.Management.Automation.PowerShell.CoreInvoke[TInput,TOutput](PSDataCollection`1 input,
                       PSDataCollection`1 output, PSInvocationSettings settings)\r\n   at
                       System.Management.Automation.PowerShell.Invoke(IEnumerable input, PSInvocationSettings
                       settings)\r\n   at Microsoft.PowerShell.DesiredStateConfiguration.Internal.ResourceProviderAdapt
                       er.ExecuteCommand(PowerShell powerShell, ResourceModuleInfo resInfo, String operationCmd,
                       List`1 acceptedProperties, CimInstance nonResourcePropeties, CimInstance resourceConfiguration,
                       LCMDebugMode debugMode, PSInvocationSettings pSInvocationSettings, UInt32\u0026
                       resultStatusHandle, Collection`1\u0026 result, ErrorRecord\u0026 errorRecord, PSModuleInfo
                       localRunSpaceModuleInfo)",
                                                                    "HelpLink":  null,
                                                                    "Source":  "System.Management.Automation",
                                                                    "HResult":  -2146233087
                                                                },
                                             "TargetSite":  null,
                                             "StackTrace":  null,
                                             "HelpLink":  null,
                                             "Source":  null,
                                             "HResult":  -2146233079
                                         },
                           "TargetObject":  null,
                           "CategoryInfo":  {
                                                "Category":  7,
                                                "Activity":  "",
                                                "Reason":  "InvalidOperationException",
                                                "TargetName":  "",
                                                "TargetType":  ""
                                            },
                           "FullyQualifiedErrorId":  "ProviderOperationExecutionFailure",
                           "ErrorDetails":  null,
                           "InvocationInfo":  null,
                           "ScriptStackTrace":  null,
                           "PipelineIterationInfo":  [

                                                     ]
                       }
FinalState           :
InDesiredState       : False
InitialState         :
InstanceName         : MinVmVersionForCpuBasedMitigations
RebootRequested      : False
ResourceName         : Registry
StartDate            : 31/01/2018 22:49:57
StateChanged         : False
PSComputerName       :
```

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/info-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />To get just the error in a nice PowerShell format, use ConvertFrom-Json. $ResourceNotInDesiredState.Error | ConvertFrom-Json

## New-xDscDiagnosticsZip
A useful command when working with colleagues to resolve DSC Problems is to send them the logs so that they may analyse and get back to you.

New-xDscDiagnosticsZip pulls information from all the available sources and nicely prepares it to send to friend :).

## File Based Log Access
In the worst case scenario when none of the previous options are available the disk is still your friend. Every DSC job is written into C:\Windows\System32\Configuration\ConfigurationStatus.

Exactly what would be written to the console, is what will be written to these files i.e. if -Verbose was not given when Start or Update-DSCConfiguration was run, then the verbose output will not be seen in these files.

As with the New-xDscDiagnosticsZip command, these file could be zipped and sent to someone else to assist with troubleshooting.

Hope this is useful for you and can help reduce the time it takes to resolve problems in your DSC Configurations.

Make sure to come back because later in the month, coming up in the series we still have nested configurations, composite resources, script and class based resources, partial configurations and much much more.

I look forward to hearing from you either in the comments or on Twitter with the #DFTAI or #28DaysOfDSC

Thanks & Don't Forget To Automate It!
