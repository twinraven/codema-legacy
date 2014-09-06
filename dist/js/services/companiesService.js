/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
App.service('companiesService', ['$location', function($location) {
    var companiesList = [],
        demoCompaniesList = [
            {
                'name':'Company 1',
                'id':2,
                'address':'1 St. John\'s Lane, London, EC1M 4BL',
                'notes':'Some notes here\n\nsome more notes',
                'contactName':'Dave Smith',
                'contactEmail':'dave@example.com',
                'contracts':[
                    {'startDate':'2012-12-12','lengthMonths':3,'renewals':2,'rate':10,'$$hashKey':'01J'},
                    {'startDate':'2013-06-10','lengthMonths':1,'renewals':0,'rate':10,'$$hashKey':'01K'}
                ]
            },
            {
                'name':'Company 2',
                'id':2,
                'address':'1 St. John\'s Lane, London, EC1M 4BL',
                'notes':'Some notes here\n\nsome more notes',
                'contactName':'Rob Ford',
                'contactEmail':'rob@example.com',
                'contracts':[]
            }
        ],
        methods = {};

    methods.loadCompanyData = function() {
        //if (!navigator.onLine) {
        var list = window.localStorage.getItem('companiesList');
        if (Modernizr.localstorage && list) {
            companiesList = JSON.parse(window.localStorage.getItem('companiesList'));
        }

        if (companiesList.length === 0) {
            companiesList = demoCompaniesList;
        }
    };

    methods.saveCompanyData = function() {
        // save to web-based resource first
        if (navigator.onLine) {
            //
        }

        window.localStorage.setItem('companiesList', JSON.stringify(companiesList));
    };

    methods.addCompany = function(newCompany) {
        newCompany.id = companiesList[companiesList.length-1].id + 1;
        companiesList.push(newCompany);

        methods.saveCompanyData();
    };

    methods.getCompanies = function(){
        return companiesList;
    };

    methods.getCompany = function(id){
        id = parseInt(id, 10);

        return _.find(companiesList, function(co) {
            return _.isEqual(co.id, id);
        });
    };

    methods.removeCompany = function(company) {
        if (company) {
            companiesList = _.without(companiesList, company);
            // redirect to homepage
            $location.path('/home');
        }

        methods.saveCompanyData();
    };

    methods.removeContract = function(companyId, contractId) {
        methods.getCompany(companyId).contracts.splice(contractId,1);
    };

    methods.loadCompanyData();

    return methods;

}]);
