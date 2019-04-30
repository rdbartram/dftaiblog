---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 7 Composite Resources'
description: Just like nested configurations, only versionable and packaged in a module
excerpt: Just like nested configurations, only versionable and packaged in a module
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - troubleshooting
readtime: 20 min
created_at: 2018-02-07 08:00
updated_at: 2018-02-07 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys,

Day 7, a whole week of DSC. Today we're taking what we learnt yesterday with the Nested Configurations and utilizing it to write Composite Resources.

So what are Composite Resources? Their functionality is basically equal to that of the Nested Configurations we wrote yesterday. The only difference is that they are versioned and exist in a module. This makes it useful to package them and deploy using the PowerShell Gallery for example.

## Structure

As with normal DSC Modules, their is the Module Manifest and DSCResources folder in the root. Inside the DSCResources folder exists a folder for each Resource you create regardless whether its Script, Composite or otherwise.

For Composite Resources, 2 files need to exist. Firstly, the \<CompositeResourceName>.psd1 manifest and the \<CompositeResourceName>.schema.psm1

If you've done created all that, you should have something like this.

![vscode DSC folder](./images/dftaisqlserverdscfolder.png)

## The Code

The dftaiSQLSetup.psd1 looks as follows. Both these properties are mandatory.

```powershell
@{
    RootModule    = 'dftaiSQLSetup.schema.psm1'
    ModuleVersion = '1.0'
}
```

Then in your schema.psm1 file, goes your ~~Nested Conf~~...Composite Resource.

Here is an example of a Composite Resource for installing SQL. Beware, as with the Nested Configurations, the Node block isn't necessary since it will be called from within DSC Configuration which is responsible for that part.

```powershell
Configuration dftaiSQLSetup {
    Param(
        [parameter(Mandatory)]
        [ValidateNotNullorEmpty()]
        [string]
        $ServerName,

        [string]
        $SQLInstanceName = "MSSQLSERVER",

        [parameter(Mandatory)]
        [ValidateNotNullorEmpty()]
        [string]
        $SourcePath,

        [string]
        $Features = "SQLENGINE",

        [string]
        $Collation = "Latin1_General_CI_AS",

        [parameter(Mandatory)]
        [PSCredential]
        $SQLSvcAccount,

        [PSCredential]
        $AgtSvcAccount = $SQLSvcAccount,

        [parameter(Mandatory)]
        [PSCredential]
        $SourceCredential,

        [object[]]
        $SQLSysAdminAccounts,

        [bool]
        $InstallSSMS
    )

    Import-DscResource -ModuleName xPSDesiredStateConfiguration
    Import-DscResource -ModuleName SqlServerDsc
    Import-DscResource -ModuleName xActiveDirectory

    PackageManagement sqlServerModule {
        Name            = 'SqlServer'
        Source          = 'PSGallery'
        Ensure          = 'Present'
        RequiredVersion = '21.0.17199'
        ProviderName    = 'PowerShellGet'
    }

    SqlSetup "sqlFeatureSetup" {
        InstanceName          = $SQLInstanceName
        SourcePath            = $SourcePath
        Features              = $Features
        SQLCollation          = $Collation
        SQLSysAdminAccounts   = $SQLSysAdminAccounts.Name
        SQLSvcAccount         = $SQLSvcAccount
        AgtSvcAccount         = $AgtSvcAccount
        SourceCredential      = $SourceCredential
        UpdateEnabled         = $true
        UpdateSource          = (Join-Path $SourcePath 'Updates')
        BrowserSvcStartupType = $true
    }

    xService "sqlServerAgent" {
        Name      = "SQLSERVERAGENT"
        State     = 'Running'
        DependsOn = "[SqlSetup]sqlFeatureSetup"
    }

    SqlWindowsFirewall "sqlFirewallSettings" {
        Features     = $Features
        InstanceName = $SQLInstanceName
        Ensure       = 'Present'
        SourcePath   = $SourcePath
        DependsOn    = "[SqlSetup]sqlFeatureSetup"
    }

    xADServicePrincipalName "spn$($sqlServerName -replace '-')" {
        Ensure               = 'Present'
        ServicePrincipalName = "MSSQLSvc/$($ServerName):1433"
        Account              = $SQLSvcAccount.Username.split("\")[1]
        DependsOn            = "[SqlSetup]sqlFeatureSetup"
    }

    $roleDependencies = @()

    $SQLSysAdminAccounts | % {
        SqlServerLogin "addLogin$($_ -replace '[-_]')" {
            Ensure       = 'Present'
            Name         = $_.name
            ServerName   = $ServerName
            InstanceName = $SQLInstanceName
            LoginType    = $_.type
        }

        $roleDependencies += "[SqlServerLogin]addLogin$($_ -replace '[-_]')"
    }

    SqlServerRole "addRole$($_ -replace '[-_]')" {
        ServerRoleName   = 'sysadmin'
        MembersToInclude = $SQLSysAdminAccounts.Name
        ServerName       = $ServerName
        InstanceName     = $SQLInstanceName
        DependsOn        = $roleDependencies
    }

    if ($Features -match ',RS,') {
        SqlRS "sqlReportingServices" {
            InstanceName         = $SQLInstanceName
            DatabaseServerName   = $ServerName
            DatabaseInstanceName = $SQLInstanceName
            DependsOn            = "[SqlSetup]sqlFeatureSetup"
        }
    }

    if ($InstallSsms) {
        Package SSMS {
            Ensure    = "Present"
            Name      = "Microsoft SQL Server Management Studio - 17.4"
            Path      = $SourcePath + "\SSMS-Setup-ENU.exe"
            ProductId = ''
            Arguments = "/install /quiet /norestart"
            LogPath   = "C:\windows\temp\SSMS_install.log"
        }
    }
}
```

This is just another example of how easy it is to simplify the installation of an otherwise complex application like SQL by hiding all the "complexity" in your Composite Resources.

To confirm that everything is working and at least your syntax is correct. You can run the Get-DSCResource command and confirm the newly created resource is visible.

![Get Composite resource](./images/getdscresource-composite.png)

Looking at how we could use this Composite Resource in a configuration, we see just how much easier we've made our and potentially someone else's life.

```powershell
Configuration SQLConfig
{
    Import-DSCResource -ModuleName dftaiSqlServerDSC

    Node $AllNodes.NodeName
    {
        dftaiSQLSetup SQL {
            ServerName          = $Node.NodeName
            SQLSvcAccount       = $Node.SQLConfig.ServiceAccount
            SourcePath          = $Node.SQL.Media
            SQLSysAdminAccounts = $Node.SQL.Admins
            SourceCredential    = $Node.FileShareUser
            InstallSSMS         = $true
        }
    }
}

$ConfigData = @{
    AllNodes = @(
        @{
            NodeName = "SQL01"
            FileShareUser = New-Object PSCredential -ArgumentList 'DFTAI\FileShareUser', (ConvertTo-SecureString 'Password' -AsPlainText -Force)
            SQL = @{
                Media = "\\FS01\SQLMedia"
                Admins = @(
                    @{
                        Name = "DFTAI\CoolUsers"
                        Type = "WindowsGroup"
                    }
                )
        }
    )
}

SQLConfig -outputpath c:\temp -ConfigurationData $ConfigData
```

This should set you on your way to create your own composite resources. Right now, we haven't learnt anything too complicated. All you're doing is collecting up all of the pre-existing resources and nicely presenting them.

Tomorrow will be the beginning of learning how to create your own script resources from scratch.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
