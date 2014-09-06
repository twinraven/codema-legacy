# Codema - Company Details Manager

A quick & easy way for contractors to keep track of the companies, contact and contracts they acquire.

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

All data is saved in local storage, on the user's machine. This is quite brittle, and not ideal, but makes for a working application right now. The very next task on this project is to save this data in Dropbox (or potentially Google Drive, whichever is the easier to work with initially) -- see below.

-----

### To do list:

* Save data in user's own Dropbox. (Potentially use Google Drive instead, or both at a later date)
* Add 'maps' page, plotting all companies on a map
* POSSIBLY: auto-lookup address, using the [Google Maps lat-long lookup](https://dexvelopers.google.com/maps/documentation/geocoding/). The latlong would be requested when an address is added, or amended, and would be stored in the company JSON data. (Better to save a latlong than use a full address lookup, for every company? Probably quite slow)

-----

Built using Angular JS, and built using the [angular-seed](https://github.com/angular/angular-seed) repo as a base.

