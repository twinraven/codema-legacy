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
            lsLastModified = window.localStorage.getItem('lastModified'),
            online = navigator.onLine;

        // Private Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        function getHighestId() {
            return _.max(companiesList, function(o){return o.id;}).id;
        }

        // Public Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.loadCompanyData = function loadCompanyData() {
            dbCompaniesRecord = dbService.getDbCompaniesRecord();

            if (dbCompaniesRecord && online) {
                $timeout(function() {
                    var dbCompaniesList = JSON.parse(dbCompaniesRecord.get('data')),
                        dbLastModified = dbCompaniesRecord.get('lastModified');

                    // if we've updated data while offline, push it up now (with the users agreement)
                    if (offlineAmends && dbLastModified !== lsLastModified) {
                        if (confirm('You\'ve changed some company data whilst offline: would you like to upload these now? This will overwrite your online data.\n\nClick \'OK\' to use your local data;\nClick \'Cancel\' to use the version stored online')) {
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
            if (dbCompaniesRecord && online) {
                dbCompaniesRecord.set('data', JSON.stringify(companiesList));
                dbCompaniesRecord.set('lastModified', now);
            }

            window.localStorage.setItem('companiesList', JSON.stringify(companiesList));
            window.localStorage.setItem('lastModified', now);

            if (!online) {
                window.localStorage.setItem('offlineAmends', true);
            }
        };

        methods.addCompany = function addCompany(newCompany) {
            if (companiesList && companiesList.length) {
                newCompany.id = getHighestId() + 1;
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

        methods.getCompaniesByContact = function getCompaniesByContact(id) {
            return _.filter(companiesList, function(obj) {
                return obj.contactId === id;
            });
        };

        methods.getCompaniesWithContact = function getCompaniesWithContact() {
            return _.filter(companiesList, function(obj) {
                return obj.contactName;
            });
        };

        methods.removeCompany = function removeCompany(company) {
            if (company) {
                companiesList = _.without(companiesList, company);
                // redirect to homepage
                $location.path('/companies');
            }

            methods.saveCompanyData();
        };

        methods.removeContract = function removeContract(companyId, contractId) {
            methods.getCompany(companyId).contracts.splice(contractId,1);
        };

        methods.removeEmptyContracts = function removeEmptyContracts(contracts) {
            if (contracts.length === 0) { return contracts; }

            var c, x = 0, y;

            for (y = contracts.length; x < y; x++) {
                c = contracts[x];

                // startDate, endDate, renewals, rate
                if (!c.startDate && !c.endDate && !c.renewals && !c.rate) {
                    contracts.splice(x, 1);

                    x--;
                    if (contracts.length === 0) {
                        break;
                    }
                }
            }

            return contracts;
        };

        methods.removeContactFromCompanies = function removeContactFromCompanies(id) {
            companiesList = _.map(companiesList, function(obj) {
                if (obj.contactId === id) {
                    obj.contactId = null;
                    obj.contactName = null;
                }
                return obj;
            });

            methods.saveCompanyData();
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $rootScope.$on('dbReady', methods.loadCompanyData);

        if (!online) { methods.loadCompanyData(); }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);
