/* Companies Service */

App.service('companiesService', [
    '$rootScope',
    '$location',
    '$timeout',
    'dbService',
    function($rootScope, $location, $timeout, dbService) {
        var companiesList = [],
            methods = {},
            dbCompaniesRecord = null,
            lsCompaniesList = JSON.parse(window.localStorage.getItem('companiesList')),
            offlineAmends = JSON.parse(window.localStorage.getItem('offlineAmends')),
            lsLastModified = window.localStorage.getItem('lastModified');

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.loadCompanyData = function loadCompanyData() {
            dbCompaniesRecord = dbService.getDbCompaniesRecord();

            if (dbCompaniesRecord && !$rootScope.offline) {
                $timeout(function() {
                    var dbCompaniesList = JSON.parse(dbCompaniesRecord.get('data')),
                        dbLastModified = dbCompaniesRecord.get('lastModified');

                    // if we've updated data while offline, push it up now (with the users agreement)
                    if (offlineAmends && dbLastModified !== lsLastModified) {
                        if (confirm('You\'ve made some data changes offline: would you like to upload these now? This will overwrite your online data.\n\nClick \'OK\' to use your local data;\nClick \'Cancel\' to use the version stored online')) {
                            companiesList = lsCompaniesList;
                            methods.saveCompanyData(); // send it back to dropbox now

                        } else {
                            companiesList = dbCompaniesList;
                        }

                        window.localStorage.setItem('offlineAmends', false);

                    } else {
                        companiesList = dbCompaniesList;
                    }
                });

            } else {
                if (Modernizr.localstorage && lsCompaniesList) {
                    $timeout(function() {
                        companiesList = lsCompaniesList;
                    });
                }
            }
        };

        methods.saveCompanyData = function saveCompanyData() {
            var now = (new Date().toUTCString());

            // save to web-based resource first
            if (dbCompaniesRecord && !$rootScope.offline) {
                dbCompaniesRecord.set('data', JSON.stringify(companiesList));
                dbCompaniesRecord.set('lastModified', now);
            }

            window.localStorage.setItem('companiesList', JSON.stringify(companiesList));
            window.localStorage.setItem('lastModified', now);

            if ($rootScope.offline) {
                window.localStorage.setItem('offlineAmends', true);
            }
        };

        methods.addCompany = function addCompany(newCompany) {
            if (companiesList && companiesList.length) {
                newCompany.id = companiesList[companiesList.length-1].id + 1;
            } else {
                newCompany.id = 1;
            }
            companiesList.push(newCompany);

            methods.saveCompanyData();
        };

        methods.getCompanies = function getCompanies(){
            return companiesList;
        };

        methods.getCompany = function getCompany(id){
            id = parseInt(id, 10);

            return _.find(companiesList, function(co) {
                return _.isEqual(co.id, id);
            });
        };

        methods.removeCompany = function removeCompany(company) {
            if (company) {
                companiesList = _.without(companiesList, company);
                // redirect to homepage
                $location.path('/home');
            }

            methods.saveCompanyData();
        };

        methods.removeContract = function removeContract(companyId, contractId) {
            methods.getCompany(companyId).contracts.splice(contractId,1);
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $rootScope.$on('dbReady', methods.loadCompanyData);

        if (!navigator.onLine) {
            $timeout(function() { $rootScope.offline = true; });
            methods.loadCompanyData();
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);
