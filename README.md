# Codema - Company Details Manager

A quick & easy way for contractors to keep track of companies, contact and contracts.

#### [Demo](https://twinraven.github.io/codema/dist/)

## Features

* *Manage Companies*: Name, Address, Phone number, Contact, Notes & Contracts
* *Manage Contacts*: Name, Email, Phone number & Notes
* *Manage Contracts*: add full contract details per company
* *Data saved in Dropbox*: All data is saved using Dropbox Datastore, so access the same data everywhere
* *Responsive layout*: Access your data on any device, just as easily.

#### Data saved in Dropbox Datastore

All data is saved in local storage, on the user's machine. If the user authenticates with Dropbox, then their data is also synced with a [Dropbox Datastore](https://www.dropbox.com/developers/datastore) - meaning they can use the app anywhere & control the same data.

## To get going:

1. Clone the repo
2. run `npm install`
3. run `bower install`
4. run `grunt dist`
5. run `grunt server`
6. visit `http://0.0.0.0:9001`
7. (Or visit the [demo](https://twinraven.github.io/codema/dist/))

-----

### To do list:

* See TODO.txt in the repo.

-----

Built using [Angular](https://github.com/angular/angular.js), [Libsass](https://github.com/sass/libsass), [Underscore](https://github.com/jashkenas/underscore), [Bower](https://github.com/bower/bower) & [Dropbox Datastore](https://www.dropbox.com/developers/datastore).