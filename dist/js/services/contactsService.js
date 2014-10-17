App.service('contactsService', [
    '$rootScope',
    '$location',
    '$timeout',
    'dbService',
    function($rootScope, $location, $timeout, dbService) {
        var contactsList = [],
            methods = {},
            dbCompaniesRecord = null,
            lsContactsList = JSON.parse(window.localStorage.getItem('contactsList')),
            offlineAmends = JSON.parse(window.localStorage.getItem('offlineAmends')),
            lsLastModified = window.localStorage.getItem('lastModified'),
            online = navigator.onLine;

        // Private Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        function getHighestId() {
            return _.max(contactsList, function(o){return o.id;}).id;
        }

        // Public Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.loadContactData = function loadContactData() {
            dbCompaniesRecord = dbService.getDbCompaniesRecord();

            if (dbCompaniesRecord && online) {
                $timeout(function() {
                    var dbContactsList = JSON.parse(dbCompaniesRecord.get('contacts')),
                        dbLastModified = dbCompaniesRecord.get('lastModified');

                    // if we've updated data while offline, push it up now (with the users agreement)
                    if (offlineAmends && dbLastModified !== lsLastModified) {
                        if (confirm('You\'ve changed some contact data whilst offline: would you like to upload these now? This will overwrite your online data.\n\nClick \'OK\' to use your local data;\nClick \'Cancel\' to use the version stored online')) {
                            contactsList = lsContactsList;
                            methods.saveContactData(); // send it back to dropbox now

                        } else {
                            contactsList = dbContactsList;
                        }

                        window.localStorage.setItem('offlineAmends', false);

                    } else {
                        contactsList = dbContactsList;
                    }
                });

            } else {
                if (Modernizr.localstorage && lsContactsList) {
                    $timeout(function() {
                        contactsList = lsContactsList;
                    });
                }
            }
        };

        methods.saveContactData = function saveContactData() {
            var now = (new Date().toUTCString());

            // save to web-based resource first
            if (dbCompaniesRecord && online) {
                dbCompaniesRecord.set('contacts', JSON.stringify(contactsList));
                dbCompaniesRecord.set('lastModified', now);
            }

            window.localStorage.setItem('contactsList', JSON.stringify(contactsList));
            window.localStorage.setItem('lastModified', now);

            if (!online) {
                window.localStorage.setItem('offlineAmends', true);
            }
        };

        methods.addContact = function addContact(newContact) {
            if (contactsList && contactsList.length) {
                newContact.id = getHighestId() + 1;
            } else {
                newContact.id = 1;
            }
            contactsList.push(newContact);

            methods.saveContactData();
        };

        methods.getContacts = function getContacts(){
            return contactsList;
        };

        methods.getContact = function getContact(id){
            id = parseInt(id, 10);

            return _.find(contactsList, function(co) {
                return _.isEqual(co.id, id);
            });
        };

        methods.removeContact = function removeContact(contact) {
            // TODO: alert user if this will leave companies without a contact?
            if (contact) {
                contactsList = _.without(contactsList, contact);
                // redirect to homepage
                $location.path('/companies');
            }

            methods.saveContactData();
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $rootScope.$on('dbReady', methods.loadContactData);

        if (!online) { methods.loadContactData(); }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);
