---
view: post
layout: post
lang: en
author: rdbartram
title: "the PowerShell GUI of the future II : HTML and CSS"
description: Creating GUIs in PowerShell is possible but how useful is it day to day
excerpt: Creating GUIs in PowerShell is possible but how useful is it day to day
cover: true
coverAlt: Illustration of the sun rising on a new day
demo: https://github.com/rdbartram/PSConfEUGUI
audio:
categories:
  - twss
tags:
  - css
  - html
  - gui
  - powershell
created_at: 2017-04-15 19:00
updated_at: 2017-04-15 19:00

meta:
  - property: og:image
    content: /images/posts/2017/4/ps-gui-future-2.png
  - name: twitter:image
    content: /images/posts/2017/4/ps-gui-future-2.png
---

HTML and CSS are the basis upon which the internet is built; every webpage is made up of HTML and invariably CSS. Most likely you've already written some HTML/CSS at school whilst in an IT class, and hopefully, it's this basic knowledge we are going to build upon to create your PowerShell GUI.

If you haven't already read how to create the XAML form which will be holding the HTML, please check it out in [Part I](ps-gui-future-1). Equally, if you've already written your UI and just want to know how to execute the PowerShell, you can jump ahead to [Part III : PowerShell...and JavaScript...](ps-gui-future-3/)

## Concept

So the HTML Application is split into 3 main parts:

*   HEAD - where all the reference to external CSS and JS lies
*   Main DIV - called main, this div is used to store dynamic HTML generated in JS
*   Script Block - where the custom JavaScript code is stored

## Code

### Main Form

Without putting in much effort, you can make your GUI look really nice just by importing the [Bootstrap](http://getbootstrap.com/) CSS and JS Libraries and assigning a couple of classes. Bootstrap is used on many websites and it serves as a good starting point to help novice HTML designers getting to grips with what is possible. To import Bootstrap simply add the following lines to your head block.

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossorigin="anonymous">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
        integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
        crossorigin="anonymous">

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
```

The core HTML of the GUI is, as I've tried to do with everything, very simple. The first div has been centered and margined using the container class. I created a little logo with some text to serve as a header for the page. Then we simply have two empty divs, one with the ID Nav and one called Main. This allows you to easily update and set both the main view and the navigation menu separately from each other.

```html
<div class="container" style="text-align:center">
    <img src="https://pbs.twimg.com/profile_images/675777404477054976/iNf3tqcS.jpg" style="height: 150px">
    <h1>PSConfEU</h1>
    <h1>Sessions</h1>

    <div style="margin-bottom: 30px" id="Nav"></div>
    <div id="Main">
    </div>
</div>
```

The navigation pane is generated on hand from the data provided from the API. PowerShell adds an instance of line 2 for every date that it retrieves from the API.

```html
<ul class="nav nav-tabs">
    <li role="navigation"><a>Monday</a></li>
    <li role="navigation"><a>Tuesday</a></li>
    <li role="navigation"><a>Wednesday</a></li>
</ul>
```

When rendered, it ends up looking something like this

insert picture

In part III we will take a look at how this happens in a little bit more detail but in short: when one of the tabs is clicked, PowerShell goes ahead and pulls the relevant data for that day and shows all the sessions, grouped nicely by time slot. To do that, you simply need to break the HTML down into its simple parts.

The first part is the panel (Line 1), the panel has a title, which we'll set to the respective time slot (Line 3). We then split the panel body into several divs to allow for separation of English, German and mixed sessions(Line 6, 9, 12). In hindsight, I could have also automated this to make it more dynamic in case there would be any additional languages, but there will always be room for improvement.

insert picture

The final part of the design is showing the session thumbnails. I wanted to have a nice large interface with pictures and so I created the following thumbnail.

```html
<div class="col-sm-6 col-md-4">
    <div class="thumbnail" style="height:500px">
        <img src="https://pbs.twimg.com/profile_images/849967841457700864/zAkxxpxI.jpg" style="height: 150px">
        <div class="caption" style="text-align:left">
            <h3>HTML and CSS</h3>
            <p><span class="label label-Info">PowerShell</span></p>
            <p><img src="http://findicons.com/files/icons/281/flag_3/128/united_kingdom_flag.png" style="height: 15px"></p>
            <p><span class="glyphicon glyphicon-home" aria-hidden="true"></span>  DFTAI Room</p>
            Ryan Bartram
            <p style="max-height: 80px">Session dedicated to the topic of HTML and CSS with regard to PowerShell GUIs.</p>
        </div>
        <div style="position: absolute; bottom: 0; margin-bottom: 25px; margin-left: 10px">
            <p><a href="#" class="btn btn-primary" role="button">iCal</a></p>
        </div>
    </div>
</div>
```

The thumbnail is made up of quite a few little parts but again by breaking them down into their individual parts makes it much clearer.

*   Line 1 - defines that the thumbnail uses the 12 grid system and that each thumbnail takes 4 md (medium) spaces or 6 sm(small) places, depending on how the window is sized
*   Line 2 - sets the height of the thumbnail so, regardless of the content, they all are the same size
*   Line 3 - defines the boundary of the picture and text
*   Line 4 - fetches my Twitter profile picture
*   Line 5 - sets the title
*   Line 6 - uses a special label class to create the PowerShell pill
*   Line 7 - grabs a generic UK flag from the internet. It would be better if a CSS glyph library could be used
*   Line 8 - sets the location, using the class glyphicon glyphicon-home to show the home icon next to the location (more can be found [here](http://getbootstrap.com/components/#glyphicons))
*   Line 9 - is just my name
*   Line 10 - is the descriptive text
*   Line 12 - create a boundary for the iCal button and pins it to the bottom of the thumbnail

The render of the thumbnail looks something like this

insert picture

### Putting it together

So now you should have a basic understanding on how you can build a simple conference agenda in HTML. Here is a snippet of what it should look like in case you've been following along.

insert picture

This is a relatively basic example of what can be done using HTML and CSS and something that could be easily improved upon. In [Part III](ps-gui-future-3/) I'm going to show you how to change this static webpage into something a little more dynamic; collapsible panels, dynamic PowerShell queries and more.

Considering this HTML could be easily improved by someone with better HTML knowledge, I encourage you to [fork](https://github.com/rdbartram/PSConfEUGUI/fork) my project on GitHub and create Pull Requests so that others can learn from what you have to offer. This blog is meant to be a community project after all.

If you have any questions please comment or tweet me using the hashtag #dftai [. Tweet](https://twitter.com/intent/tweet?text=#DFTAI) As of writing this I'm not yet an active twitter user but I'm sure I'll get round to it. I guess the last thing to say is I appreciate you reading this.

Don’t Forget To Automate It
