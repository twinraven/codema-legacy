/* Companies Service */

App.service('companiesService', [
    '$rootScope',
    '$location',
    '$timeout',
    'dbService',
    function($rootScope, $location, $timeout, dbService) {
        var companiesList = [],
            methods = {},
            dbCompaniesList = null;

        // Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~

        methods.loadCompanyData = function loadCompanyData() {
            dbCompaniesList = dbService.getDbCompaniesList()

            if (navigator.onLine && dbCompaniesList) {
                $timeout(function() {
                    companiesList = JSON.parse(dbCompaniesList.get('data'));
                });

            } else {
                var list = window.localStorage.getItem('companiesList');

                if (Modernizr.localstorage && list) {
                    $timeout(function() {
                        companiesList = JSON.parse(window.localStorage.getItem('companiesList'));
                    });
                }
            }
        };

        methods.saveCompanyData = function saveCompanyData() {
            console.log('saving company data');
            // save to web-based resource first
            if (navigator.onLine && dbCompaniesList) {
                dbCompaniesList.set('data', JSON.stringify(companiesList));
            }

            window.localStorage.setItem('companiesList', JSON.stringify(companiesList));
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

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return methods;
    }
]);
