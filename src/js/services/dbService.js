/* Dropbox Service */

App.service('dbService', [
    '$rootScope',
    '$timeout',
    '$cookies',
    function($rootScope, $timeout, $cookies){
        var methods = {},
            dbCompaniesTable,
            dbCompanies = [],
            dbSettings = {
                key: 'peo2jcopy5i7qtq'
            },
            online = navigator.onLine,
            dbClient = (online ? new Dropbox.Client(dbSettings) : null),
            dbClientUrl = window.location.href,
            dbTable = null,
            dbCompaniesRecord = null,
            dbCompaniesAry = null,
            dbLoading = true,
            dbLoggedIn = false,
            loginStatusInFlux = false,
            noModal = false,

            preferenceIsOffline = $cookies.preferenceIsOffline ? JSON.parse($cookies.preferenceIsOffline) : false,
            preferenceExpires = $cookies.preferenceExpires ? parseInt($cookies.preferenceExpires, 10) : null;


        // private methods ~~~~~~~~~~~~~~~~~~~

        function authenticateCallback(err, dbClient) {
            if (dbClient && dbClient.isAuthenticated()) {
                resolveLoginStatus(true);
                resetPreferences();
                openDatastore();

            } else {
                if (!noModal) {
                    $rootScope.$broadcast('showAuthModal');
                }
                noModal = false;
            }
        }

        function resolveLoginStatus(bool) {
            $timeout(function() {
                dbLoggedIn = bool;
                loginStatusInFlux = false;
            });
        }

        function dataIsReady() {
            $timeout(function() { dbLoading = false; });

            $rootScope.$broadcast('dbReady');
        }

        function openDatastore() {
            var datastoreManager = new Dropbox.Datastore.DatastoreManager(dbClient);

            datastoreManager.openDefaultDatastore(function(error, dbDatastore) {
                if ( error ) { console.log( 'Datastore error: ' + error ); return; }

                dbTable = dbDatastore.getTable( 'allData' );
                dbCompaniesAry = dbTable.query();

                setDbCompaniesRecord();

                dataIsReady();
            });
        }

        function setDbCompaniesRecord() {
            if (!dbCompaniesAry.length) {
                var list = $rootScope.companiesList || [];
                dbCompaniesRecord = dbTable.insert({
                    data: JSON.stringify(list),
                    created: new Date()
                });
            } else {
                dbCompaniesRecord = dbCompaniesAry[0];
            }
        }

        function setupDbAuthDriver() {
            if (!dbClient) { return; }

            // get a clean url, for passing to the authDriver below
            if (dbClientUrl.indexOf('index.html') !== -1) { dbClientUrl = dbClientUrl.split('index.html')[0]; }
            if (dbClientUrl.indexOf('#/') !== -1) { dbClientUrl = dbClientUrl.split('#/')[0]; }

            dbClient.authDriver(new Dropbox.AuthDriver.Popup({
                receiverUrl: dbClientUrl + 'oauth_receiver.html'
            }));
        }

        function checkCookiePreferenceExpiry() {
            var now = new Date().getTime();

            if (preferenceExpires === null || preferenceExpires < now) {
                resetPreferences();
            }
        }

        function resetPreferences() {
            $cookies.preferenceIsOffline = false;
            preferenceIsOffline = false;
        }

        // public methods ~~~~~~~~~~~~~~~~~~~

        methods.dbAuth = function authenticate(userInitiated) {
            $timeout(function() {
                loginStatusInFlux = true;
                dbLoading = true;
            });

            if (!online || preferenceIsOffline) {
                resolveLoginStatus(false);
                dataIsReady();
                return;
            }

            if (dbClient.authError) { dbClient.reset(); }

            if (userInitiated) {
                // if the user has clicked to auth, run the auth now
                // (with potential popup -- has to happen after user click,
                // otherwise we get popup-blocked)
                dbClient.authenticate(authenticateCallback);

            } else {
                // if we're requesting this programmatically (i.e. at startup),
                // then set interactive=false, so it won't open the popup
                dbClient.authenticate({ interactive: false }, authenticateCallback);
            }
        };

        methods.isDbLoggedIn = function getDbLoggedIn() {
            return dbLoggedIn;
        };

        methods.getDbCompaniesRecord = function getDbCompaniesRecord() {
            return dbCompaniesRecord;
        };

        methods.isLoginStatusInFlux = function isLoginStatusInFlux() {
            return loginStatusInFlux;
        };

        methods.isDbLoading = function isDbLoading() {
            return dbLoading;
        };

        methods.isOnline = function isOnline() {
            return online;
        };

        methods.setOfflinePreference = function setOfflinePreference(bool) {
            preferenceIsOffline = bool;
        };

        methods.dbLogOut = function dbLogOut() {
            $timeout(function() {
                loginStatusInFlux = true;
            });

            if (dbClient.isAuthenticated()) {
                dbClient.signOut(null, function() {
                    $timeout(function() {
                        dbLoggedIn = false;
                        loginStatusInFlux = false;
                    });
                });
            }
        };

        methods.dbLogIn = function dbLogIn() {
            if (dbClient.authError) { dbClient.reset(); }

            $timeout(function() { loginStatusInFlux = true; });

            noModal = true;
            dbClient.authenticate(authenticateCallback);
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        checkCookiePreferenceExpiry();
        setupDbAuthDriver();

        return methods;
    }
]);