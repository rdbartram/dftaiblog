---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 10 Delegating DSC Access - WMI'
description: In it's default state, DSC can only be administered by the local admins of the windows machine. This can be problematic if you want to assign lower privileged users.
excerpt: In it's default state, DSC can only be administered by the local admins of the windows machine. This can be problematic if you want to assign lower privileged users.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - security
  - WMI
readtime: 5 min
created_at: 2018-02-10 08:00
updated_at: 2018-02-10 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 10! Since it's the weekend again, I'm gunna make these next two posts really short.

They are both going to revolve around security and how we can limit access to DSC.

In it's default state, DSC can only be administered by the local admins of the windows machine. This can be problematic if you want to assign lower privileged users, i.e. Helpdesk etc to view the status of/set the LCM.

Since all the LCM commands are WMI calls, all we need to do is restrict access to the WMI Class.

Allowing Enable Account and Execute Methods on the following two Namespaces enables (to the best of my knowledge) all the necessary DSC commands i.e. Get-DSCConfigurationStatus, Start-DSCConfiguration, Get-DSCLocalConfigurationManager etc.

- root/Microsoft/Windows/DesiredStateConfiguration
- root/Microsoft/Windows/DesiredStateConfigurationProxy

If you wanted to be able to trigger the commands remotely, then Remote Enable would also be necessary

To go about enabling this, you can do it a couple of different ways, the easiest would be over DSC itself. Microsft have a resource called [WMINamespaceSecurity](https://github.com/PowerShell/WmiNamespaceSecurity) which we can used for this exact purpose.

Shout out to Steve Lee who I believe start right this module. His original blog post about setting WMI through PowerShell can be found [here](https://blogs.msdn.microsoft.com/wmi/2009/07/20/scripting-wmi-namespace-security-part-1-of-3/).

To provide delegated access to group of users we could create a configuration like this.

```powershell
configuration DSCLeastPrivilege {
    param(
        $Group
    )

    Import-DSCResource -ModuleName WmiNamespaceSecurity

    WMINamespaceSecurity DSC {
        Path = "root/Microsoft/Windows/DesiredStateConfiguration"
        Principal = $Group
        AppliesTo = "Self"
        AccessType = "Allow"
        Permission = "Enable", "MethodExecute"
        Ensure = "Present"
    }

    WMINamespaceSecurity DSCProxy {
        Path = "root/Microsoft/Windows/DesiredStateConfigurationProxy"
        Principal = $Group
        AppliesTo = "Self"
        AccessType = "Allow"
        Permission = "Enable", "MethodExecute"
        Ensure = "Present"
    }
}
```

Tomorrows session will be about how to further lock down DSC to provide access to specific PowerShell commands i.e. all the Gets but not Start or Publish. That will involve implementing JEA.

Anyway, I hope your've been enjoying this series so far. However, I need your input though to make it better. Please let me know what else you would like covered: shorter/longer posts, less/more information. I'm ready for constructive criticism!

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
