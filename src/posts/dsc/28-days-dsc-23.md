---
view: post
layout: post
lang: en
author: rdbartram
title: '28 Days of DSC: Day 23 Contributing To The Community - A Git Crash Course'
description: I just want to go through a start to finish example of how you can take an existing project and extend its functionality. Forking, committing, merging and pull requests
excerpt: I just want to go through a start to finish example of how you can take an existing project and extend its functionality. Forking, committing, merging and pull requests
cover: true
coverFullPath: /images/28dsc
categories:
  - dsc
tags:
  - dsc
  - git
  - github
  - pull request
readtime: 14 min
created_at: 2018-02-23 08:00
updated_at: 2018-02-23 08:00

meta:
  - property: og:image
    content: /image/28dsc_twitter.png
  - name: twitter:image
    content: /image/28dsc_twitter.png
---

Hey Guys!

Day 23! Today, I want to take a short break from talking DSC and making sure you are all able to take the information you have and invest it in improving the open source resources found on GitHub.

Some of you might already work frequently with Git and GitHub, but I remember a couple of years ago when I first started working on GitHub; I literally had no idea what was going on and I would have been glad for some help. I don't think I've seen a complete guide on how to contribute to a Git Repo before, so hope this helps.

So today, I just want to go through a start to finish example of how you can take an existing project and extend its functionality. Forking, committing, merging and pull requests. It's all going to be covered here as clear and concisely as possible.

## Forking 🍴

The first step is obviously finding the project you want to work with. For this example I'm going to do something I've been meaning to do for a while, and update the [xDnsServer](https://github.com/PowerShell/xDnsServer) repo.

Currently, you can only create either A or C Records. This isn't great and I'd like to fix that.

So...we fork 🍴!

![git fork](./images/gitfork.png)

What this has done is make a copy of Microsoft's project within your profile. The reason you need to do this is because Microsoft isn't going to grant you permission to make changes directly in their project. They are nice people...but not that nice.

If everything is done right, then you should have a new repo in your profile and it should look like this.

![git forked](./images/gitforked.png)

## Cloning 👯

The next thing you want to do it get the project downloaded on to your machine so you can start working on it.

We could use the git bash for this and I very often do use the bash but for simplicity let's use our favourite Code editor, <a href="https://code.visualstudio.com" rel="noopener" target="_blank">VSCode</a>.

By default, VSCode has a git client available, however, I would highly recommend installing a couple of extensions to help you get going with PowerShell and Git.

![vscode extensions](./images/vscodeextensions.png)

- Git: Common Commands Suite will allow us to add remotes (we'll need this later).
- GitLens has a lot of cool features to help analyse who, did, what, where, when.
- PowerShell is a no brainer...this should be already installed in all of your VSCode workspaces.

Once all these tools are available you can clone a repo by entering the command palette (F1) and entering Git Clone

![git clone](./images/vscodegitclone.png)

Following the prompts, passing the url of your GitHub xDnsServer project (Copy from address bar) and then defining the path in which the xDnsServer folder will be created (By default this is the user profile C:\Users\Ryan).

Ok cool! You have a working git repo on your machine.

## Branching 🌳

So now we get onto a bit of technical topic of git. I don't want to make this a whole philosophical discussion about branching policies. Microsoft have a whole section of [docs.microsoft.com](https://docs.microsoft.com/en-us/vsts/git/branch-policies-overview) dedicated to the topic, you can read up about it once you've got the basics down.

By default you should have the dev branch active (Checked Out). What I'm recommending to you now is creating a new branch and using the naming convention feature/\<thing I'm doing>. I said we we're going to support some new DNS record types so let's create one called feature/mxrecord.

You can do this in VSCode by clicking on the branch name in the bottom left corner of the screen. This opens the command palette and presents the option to create a new branch

![create branch](./images/vscodecreatebranch.png)

The advantage of doing this is that if you are working on bringing MX, SRV and AAAA Records to the module but Microsoft only want to accept MX. Having the feature split out into separate branches means that when you are ready to send your work to Microsoft for review (create a Pull Request), they can accept the features separately at their own discretion.

The alternative if you we're to work just in dev and Microsoft said no we don't like this change, you would have to delete that work or copy it somewhere else...not cool!

## Do Work 👨‍💻

OK, so we have done all the preparatory steps are done, we can actually code.

Implement all the skills we've covered here to create an awesome script/class based resource. Make sure you Unit test it and make everything ready to send back to Microsoft.

## Commit and Push 💾👐

Once you are this far, you'll want to save (commit) your work to git. Saving the file itself doesn't actually do anything in git. To get your changes into git you need to head over to the Version Control tab of VSCode and both "Commit" and "Push" your changes.

Here you can click on the plus to stage the changes you want to commit, provide a message as to the contents of the change and push.

![git commit](./images/VSCodeCommit.png)

![git push](./images/vscodepush.png)

Now all your changes should be visible on GitHub for everyone to see.

## Pull Request 📨

So now all your work is done committed and pushed back to GitHub, you are ready to create your Pull Request.

To do this, head over to your Repo and select the New Pull Request option

![git PR](./images/gitPR.png)

You'll be presented with the option to select the source and destination branches, a chance to provide a title and description and review the contents of the change.

![git create PR](./images/gitPRCreate.png)

If all goes well, you have worked on a feature that nobody else is working on, all your tests are good etc, then the Pull Request will have a green check and say good to merge.

If you have conflicts, then maybe you're day isn't going to be such a happy one 😭.

Once the change has been accepted and the Pull Request has been completed, you can either delete the whole repo because you don't need to work on it anymore, or you can checkout dev again and delete your feature/mxrecord branch.

When you need to develop a new feature you just start the process again from the branching part. Checkout dev, pull from microsoft/dev (to make sure you are up-to-update) and create a new branch named appropriately to that what you are doing.

## Merging 😈

Conflicts, conflicts, conflicts.

Try as you might, you will inevitable one day try to commit something either directly or via a Pull Request and notice that there are conflicts.

What you need to do now, is pull the destination branch into you current one and address the conflicts.

In our example we are trying to merge with a completely separate repo i.e. PowerShell/xDnsServer.

If we were working within our on repo we could skip this next step.

Remotes

Remotes are the remote locations where are branches are hosted. By default origin maps to your own remote copy i.e. rdbartram\xDnsServer. If I wanted to merge dev into feature/mxrecord, I could simply select the Pull From... option and choose origin and then dev.

![Git Pull From](./images/gitpullfrom.png)

![git remotes](./images/gitpullremotes.png)

However, in our case as I said previously we are working with another remote repo. So what we need to do is add that to our git configuration. To do this go into the command palette (F1) and type git remote add. Specify a name i.e. upstream or Microsoft and then paste in the url for the Microsoft xDnsServer repo (copy from the address bar the same as for cloning.).

Now that you have the additional remote, you can do the Pull From... again, except this time choose upstream/Microsoft etc and then dev.

This will merge the latest updates from Microsoft with yours and if there are conflicts, you'll have to resolve them.

VSCode does has a decent merge tool built-in. When conflicts are detected, VSCode will show them in the Version Control tab. Both the current and incoming changes will be highlighted and you can choose to either accept one, the other, both or fix it by hand.

![git conflict](./images/gitconflict.png)

Once your conflicts are resolve, you can do the normal commit push process to send the changes back to GitHub.

The Pull Request will automatically detect the push and update itself accordingly.

## Conclusion 🏁

So that's it, you've made an improvement to an open source project. You made the DSC world a better place!

I hope this was a useful topic for you, even if it wasn't strictly DSC related.

If you've missed any of the other posts from the 28 Days of DSC series, check them out [here](/posts/?tag=dsc).

If you have any questions or suggestions for topics to cover in the series, hit me up on twitter.

Thanks!

and Don't Forget To Automate It!
