---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 2 Using Configuration Data'
description: ConfigurationData is the way in which we pass variables into our DSC Configuration scripts. This post aims to provide a couple of tips on how to make using configdata a little easier.
excerpt: ConfigurationData is the way in which we pass variables into our DSC Configuration scripts. This post aims to provide a couple of tips on how to make using configdata a little easier.
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - configurationdata
readtime: 9 min
created_at: 2018-02-02 08:00
updated_at: 2018-02-02 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys, two posts on consecutive days...amazing!

Following on from my post from yesterday, [The Basics](28-days-dsc-1), I'm going to show you what ConfigurationData is all about.

During this month there will be some easy topics and some not so easy topics. ConfigurationData can be one of those more complicated topics if you aren't used to working with data.

Please don't be disheartened! We all start somewhere and there is a wealth of information and people out there to help you.

The basics are covered over on [The Basics](<[docs.microsoft.com](https://docs.microsoft.com/en-us/powershell/dsc/configdata)>), however I'm hoping to add a little real world experience to the mix.

Since the declaration of the configdata is well documented and fairly simply let's jump straight into the tips.

## 1. Use the nodename \* block to assign information to all subsequent nodes

This is useful for example if the configdata block consists entirely or mostly or machines belonging to a single domain, informations such as domain name, domain join credential and dns settings could be defined.

```powershell
@{
    Nodename = "*"
    DomainName = "dftai.local"
    DomainJoinCredential = Get-Credential
    DNSServers = @("192.168.1.1", "192.168.1.2")
}
```

If it needs to be overwritten, it can be done simply by defining the property again at the specific node.

```powershell
@{
    Nodename = "PerimeterServer"
    DNSServers = @("192.168.2.1", "192.168.2.2")
}
```

## 2. Separate ConfigData blocks into separate files

Having separate files for say development, integration & production is a good way to start separating out your config data.

Splitting them up even further by departments or applications means the files are easier to read, since they're smaller.

And an added benefit is when using version control systems such as git, you reduce the change of merge conflicts occuring.

## 3. Use Non-NodeData

Use Non-NodeData with the property roles to pickup data as necessary depending on the node role assignments

```powershell
@{
    AllNodes = @(
        @{
            Nodename = "SQL01"
            Roles = @("SQL", "MyCoolApp")
        },
        @{
            Nodename = "SQL02"
            Roles = @("SQL", "MyOtherCoolApp")
        }
    )
    SQLData = @(
        @{
            Roles = @("SQL","MyCoolApp")
            Properties = @{
                InstanceName = "MyCoolApp"
                ...
            }
        },
        @{
            Roles = @("SQL","MyOtherCoolApp")
            Properties = @{
                InstanceName = "MyOtherCoolApp"
                ...
            }
        }
    )
}
```

To get this data in the configuration script, use the following example. It may look complicated but basically, it's comparing the list of roles in the SQLData object to see if they are all present/one is present on the node, if true return, if not move on.

```powershell
#Check Any Role Is Present
$SQLConfigData = $ConfigurationData.SQLData.Where({Compare-Object $_.Roles $Node.Roles -ExcludeDifferent -IncludeEqual}).Properties

#Confirm All Roles Are Present
$SQLConfigData = $ConfigurationData.SQLData.Where({(Compare-Object $_.Roles $Node.Roles | ? {$_.SideIndicator -eq "<="}) -eq $null}).Properties
```

## 4. Keep It Simple

This may seem in contrast to the last point, but when necessary, we can get clever and do cool things but at the end of the day we need to be able to read and understand what is going on. Over-engineering just means fewer people can support you and your configurations.

## 5. Seek help from the community

Hopefully you are already involved in the DSC community, but for those of you needing to maintain large configuration data sets, perhaps for 10s/100s/1000s of nodes with x applications. Consider using a solution already built and tested to help handle such complexity.

A lot of DSC engineers, have their own methods of generating ConfigData from SQL Databases and APIs etc.

I would recommend chceking out Gael Colas @gaelcolas, he created a project on GitHub called [Datum](https://github.com/gaelcolas/Datum) which does similar things to that what I've already mentioned but with a few nice added features.

Firstly, its file based which means it can be easily versioned in something like git.

Also, it has features such as being able to set precedence in order to determine what the "Resultant Set" of properties are, think GPO.

The built-in lookup tool can be used to easily show how the configdata looks for any particular node; useful when someone quickly wants to know how the config looks for SQL01.

```powershell
$Datum = New-DatumStructure -DefinitionFile .\Datum.yml

lookup 'SQLData' -Node 'SQL01' -DatumTree $Datum
# Name                           Value
# ----                           -----
# InstanceName                   MyCoolApp
# SourcePath                     \\SoftwareRepo\SQL\2017

lookup 'SQLData' -Node 'SQL02' -DatumTree $Datum
# Name                           Value
# ----                           -----
# InstanceName                   MyOtherCoolApp
# SourcePath                     \\SoftwareRepo\SQL\2014
```

## Putting it together

Here is a very simple SQL installation using configdata and the skills we've learned over the last 2 posts.

```powershell
Configuration SQL {

    Import-DSCResource -ModuleName SqlServerDsc -ModuleVersion 10.0.0.0

    node $AllNodes.NodeName {

        #Confirm All Roles Are Present
        $SQLConfigData = $ConfigurationData.SQLData.Where({(Compare-Object $_.Roles $Node.Roles | ? {$_.SideIndicator -eq "<="}) -eq $null}).Properties

        SqlSetup $SQLConfigData.InstanceName
        {
            InstanceName = $SQLConfigData.InstanceName
            Features     = 'SQLENGINE'
            SourcePath   = $SQLConfigData.SourcePath
        }
    }
}

$ConfigData = @{
    AllNodes = @(
        @{
            Nodename = "SQL01"
            Roles = @("SQL", "MyCoolApp")
        },
        @{
            Nodename = "SQL02"
            Roles = @("SQL", "MyOtherCoolApp")
        }
    )
    SQLData = @(
        @{
            Roles = @("SQL","MyCoolApp")
            Properties = @{
                InstanceName = "MyCoolApp"
                SourcePath   = "\\SoftwareRepo\SQL\2017"
            }
        },
        @{
            Roles = @("SQL","MyOtherCoolApp")
            Properties = @{
                InstanceName = "MyOtherCoolApp"
                SourcePath   = "\\SoftwareRepo\SQL\2014"
            }
        }
    )
}

#Generate MOF Files
SQL -ConfigurationData $ConfigData

#PUSH MOFS to Servers
Start-DSCConfiguration .\SQL
```

Phew! Another day, another DSC topic covered, only 26 more days until you are a master of the "desired state" arts.

I look forward to hearing from you either in the comments or on Twitter with the #DFTAI or #28DaysOfDSC, either because something is unclear or to tell me you're enjoying the series.

Thanks & Don't Forget To Automate It!
