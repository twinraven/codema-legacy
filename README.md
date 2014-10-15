# Codema - Company Details Manager

A quick & easy way for contractors to keep track of companies, contact and contracts.

#### [Demo](https://twinraven.github.io/codema/dist/)

## Features

#### Store Company data

Including:
* Company name, address & notes
* Contact details (the person who you should contact for work-related queries) - name, email & phone number
* Contract details - record the start date, length, rate, and no. of renewals of past contracts.

#### Search by company name

Ordered alphabetically.

#### Search by contact

View companies organised by your contact for them. Especially helpful for recruiters.

#### Save data

All data is saved in local storage, on the user's machine. If the user authenticates with Dropbox, then their data is synced with a [Dropbox Datastore](https://www.dropbox.com/developers/datastore) - meaning they can use the app anywhere & control the same data.

-----

### To do list:

* Handle switching from oneline->offline, or vice versa -- should fall back/scale up gracefully with Local Storage
* Auto-complete the contact field, making it easy to re-use contacts (without errors)
* Add 'maps' page, plotting all companies on a map
* POSSIBLY: auto-lookup address, using the [Google Maps lat-long lookup](https://dexvelopers.google.com/maps/documentation/geocoding/). The latlong would be requested when an address is added, or amended, and would be stored in the company JSON data. (Better to save a latlong than use a full address lookup, for every company? Probably quite slow)

-----

Built using [Angular](https://github.com/angular/angular.js), [SASS](https://github.com/sass/sass), [Underscore](https://github.com/jashkenas/underscore), [Bower](https://github.com/bower/bower) & [Dropbox Datastore](https://www.dropbox.com/developers/datastore).