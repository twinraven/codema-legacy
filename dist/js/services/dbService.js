/* Dropbox Service */

App.service('dbService', [
    '$rootScope',
    '$timeout',
    function($rootScope, $timeout){
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
            loginStatusInFlux = true;

        // private methods ~~~~~~~~~~~~~~~~~~~

        function updateAuthenticationStatus(err, dbClient) {
            if (dbClient && dbClient.isAuthenticated()) {
                console.log('auth');
                $timeout(function() {
                    dbLoggedIn = true;
                    loginStatusInFlux = false;
                });
                dbIsLoggedIn();

            } else {
                console.log('not auth');
                $timeout(function() {
                    dbLoggedIn = false;
                    dbLoading = false;
                    loginStatusInFlux = false;
                });

                $rootScope.$broadcast('dbReady');
            }
        }

        function dbIsLoggedIn() {
            var datastoreManager = new Dropbox.Datastore.DatastoreManager(dbClient);

            datastoreManager.openDefaultDatastore(function(error, dbDatastore) {
                if ( error ) { console.log( 'Datastore error: ' + error ); return; }

                dbTable = dbDatastore.getTable( 'allData' );
                dbCompaniesAry = dbTable.query();

                setDbCompaniesRecord();

                $rootScope.$broadcast('dbReady');
                dbLoading = false;

                //dbCompaniesRecord.get('data');
                //dbCompaniesRecord.set('data', JSON.stringify(companiesList));
                //dbCompaniesRecord.deleteRecord();
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

        function initDb() {
            $timeout(function() {
                loginStatusInFlux = true;
            });

            // get a clean url, for passing to the authDriver below
            if (dbClientUrl.indexOf('index.html') !== -1) { dbClientUrl = dbClientUrl.split('index.html')[0]; }
            if (dbClientUrl.indexOf('#/') !== -1) { dbClientUrl = dbClientUrl.split('#/')[0]; }

            if (online) {
                dbClient.authDriver(new Dropbox.AuthDriver.Popup({
                    receiverUrl: dbClientUrl + 'oauth_receiver.html'
                }));

                $timeout(function() {
                    dbLoading = true;
                });

                // Check to see if we're authenticated already.
                dbClient.authenticate(updateAuthenticationStatus);

            } else {
                updateAuthenticationStatus();
            }
        }

        // public methods ~~~~~~~~~~~~~~~~~~~

        methods.isDbLoggedIn = function getDbLoggedIn() {
            return dbLoggedIn;
        };

        methods.getDbCompaniesRecord = function getDbCompaniesRecord() {
            return dbCompaniesRecord;
        };

        methods.isLoginStatusInFlux = function getDbState() {
            return loginStatusInFlux;
        };

        methods.isDbLoading = function isDbLoading() {
            return dbLoading;
        };

        methods.isOnline = function isOnline() {
            return online;
        }

        methods.dbLogOut = function dropboxLogout() {
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

        methods.dbLogIn = function dropboxLogout() {
            if (dbClient.authError) {
                dbClient.reset();
            }

            loginStatusInFlux = true;

            dbClient.authenticate(updateAuthenticationStatus);
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        initDb();

        return methods;
    }
])