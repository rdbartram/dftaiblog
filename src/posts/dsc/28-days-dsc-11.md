---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 11 Delegating DSC Access - JEA'
description: JEA defines that we create a specialized PowerShell session that has restricted access to PowerShell
excerpt: JEA defines that we create a specialized PowerShell session that has restricted access to PowerShell
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - JEA
  - security
readtime: 9 min
created_at: 2018-02-11 08:00
updated_at: 2018-02-11 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 11! Yesterday we setup least privilege so that only a restricted list of principals could access DSC. Now we're going to take it a step further and be more granular with our access to DSC.

Since DSC doesn't provide anyway for us to do this natively, we need to implement another feature of PowerShell gifted to us be Jeffrey Snover, JEA (Just Enough Administration).

Detailed infos on JEA can be found [here](https://msdn.microsoft.com/en-us/library/dn896648.aspx), but briefly, the concept of JEA defines that we create a specialized PowerShell session that has restricted access to PowerShell. Using predefined "Role Definitions", it is possible to granularly allow commands to be executed in the context of another user, in the best case with a Group Managed Service Account.

## Creating the role definitions

To simplify the process for creating these role definitions and session configurations, Microsoft provides a PowerShell based GUI, the [JEA Toolkit Helper 2.0](https://blogs.technet.microsoft.com/privatecloud/2015/12/20/introducing-the-updated-jea-helper-tool/).

In the screenshots below, you see how I created a module called DSCDelegatedAcces and then defined a role called HelpDesk. In that role I defined that the users can run the following commands:

- Get-DscLocalConfigurationManager
- Get-DscResource
- Enable-DscDebug
- Disable-DscDebug
- Start-DscConfiguration

The last command Start-DscConfiguration is slightly more complex since I defined that the user can only run it with the -UseExisting switch, basically preventing them from pushing a new configuration to the machine, only reapplying the existing.

#### Create Module and Role Defintion

![DSC Role Module](./images/DSCRoleModule.png)

#### Define Role Defintion

![DSC Helpdesk Role](./images/DSCHelpdeskRoleDesign.png)

## Creating Session Configuration

The Session Configuration is the component which links your Role Definitions to the required users. Going back to the JEA Toolkit, it can be done like this.

![DSC Configuration Config](./images/DSCConfigurationConfig.png)

However, since we are DSC minded people, why don't we configure the session using a DSC Resource.

Looking at the config below, you can see how to assign Role Definitions to a group or user and create the subsequent Session.

```powershell
Configuration DSC-JEA
{
    Import-DscResource -Module JustEnoughAdministration

   JeaEndpoint DSCManagement
   {
       EndpointName = "DSCManagement"
       RoleDefinitions = "@{ 'DFTAI\HelpdeskUsers' = @{ RoleCapabilities = 'HelpDesk' } }"
       TranscriptDirectory = 'C:\ProgramData\JeaEndpoint\Transcripts'
    }
}
```

> <lazy-load tag="img" :data="{ src: 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/warning-icon.png', alt: 'info', width:75, style:'float:left; margin: 0 15px 0 0' }" />Beware that the Role Definitions Module (DSCDelegatedAccess) has to be available on the machine for the commands to be available for the restricted user. This can be copied to the PSModulePath or pushed over a nugget Repo (private PSGallery)

## Testing

So now everything's set up, let's see what happens. Logged in as a test user that is a member of the helpdesk group you can see we have only the limited commands of the HelpDesk role.

![JEA DSC](./images/JEADSCExample.png)

Note what happens when I tried to use the Start-DscConfiguration command with the path parameter and then with the UseExisting switch.

![JEA DSC Fail](./images/JEADSCExample-Fail.png)

Ok, that's JEA built for DSC in a nutshell. Hopefully this helps you guys get your DSC environments to a point where they are almost bulletproof.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
