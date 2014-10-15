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
            dbClient = new Dropbox.Client(dbSettings),
            dbClientUrl = window.location.href,
            dbTable = null,
            dbCompaniesRecord = null,
            dbCompaniesAry = null,
            dbLoginStatus = false;

        // private methods ~~~~~~~~~~~~~~~~~~~

        function updateAuthenticationStatus(err, dbClient) {
            if (dbClient && dbClient.isAuthenticated()) {
                console.log('auth');
                $timeout(function() {
                    dbLoginStatus = true;
                    $rootScope.isLoginStateInFlux = false;
                });
                dbIsLoggedIn();

            } else {
                console.log('not auth');
                $timeout(function() {
                    dbLoginStatus = false;
                    $rootScope.isLoading = false;
                    $rootScope.isLoginStateInFlux = false;
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
                $rootScope.isLoading = false;

                //dbCompaniesRecord.get('data');
                //dbCompaniesRecord.set('data', JSON.stringify(companiesList));
                //dbCompaniesRecord.deleteRecord();
            });
        }

        function setDbCompaniesRecord() {
            if (!dbCompaniesAry.length) {
                dbCompaniesRecord = dbTable.insert({
                    data: JSON.stringify($rootScope.companiesList),
                    created: new Date()
                });
            } else {
                dbCompaniesRecord = dbCompaniesAry[0];
            }
        }

        function init() {
            $timeout(function() {
                $rootScope.isLoginStateInFlux = true;
            });

            // get a clean url
            if (dbClientUrl.indexOf('index.html') !== -1) { dbClientUrl = dbClientUrl.split('index.html')[0]; }
            if (dbClientUrl.indexOf('#/') !== -1) { dbClientUrl = dbClientUrl.split('#/')[0]; }

            dbClient.authDriver(new Dropbox.AuthDriver.Popup({
                receiverUrl: dbClientUrl + 'oauth_receiver.html'
            }));

            // Check to see if we're authenticated already.
            if (navigator.onLine) {
                $timeout(function() {
                    $rootScope.isLoading = true;
                });

                dbClient.authenticate(updateAuthenticationStatus);

            } else {
                updateAuthenticationStatus();
            }
        }

        // public methods ~~~~~~~~~~~~~~~~~~~

        methods.getDbLoginStatus = function getDbLoginStatus() {
            return dbLoginStatus;
        };

        methods.getDbCompaniesRecord = function getDbCompaniesRecord() {
            return dbCompaniesRecord;
        };

        methods.dbLogout = function dropboxLogout() {
            console.log('now');
            $timeout(function() {
                $rootScope.isLoginStateInFlux = true;
            });

            if (dbClient.isAuthenticated()) {
                dbClient.signOut(null, function() {
                    $timeout(function() {
                        dbLoginStatus = false;
                        $rootScope.isLoginStateInFlux = false;
                    });
                });
            }
        };

        methods.dbLogin = function dropboxLogout() {
            if (dbClient.authError) {
                dbClient.reset();
            }

            $rootScope.isLoginStateInFlux = true;

            dbClient.authenticate(updateAuthenticationStatus);
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        init();

        return methods;
    }
])