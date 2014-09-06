/**
 *   - v0.1.0 - 2014-09-06
 *  (c) 2014 Tom Bran All Rights Reserved
 */ 

// App initialisation
var App = angular.module('Codema', ['ngRoute']);
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

App.controller('AddController', ['$scope', 'companiesService',
    function($scope, companiesService) {

        $scope.company = {};
        $scope.company.contracts = [];

        $scope.saveCompany = function() {
            companiesService.addCompany($scope.company);
        };

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function($index) {
            if (confirm('Are you sure?')) {
                $scope.company.contracts.splice($index, 1);
            }
        };
    }
]);

App.controller('ContactController', ['$scope', 'companiesService',
    function($scope, companiesService) {
        $scope.companies = companiesService.getCompanies();

        $scope.contacts = _.uniq(_.pluck($scope.companies, 'contactName'));

        $scope.companiesByContact = _.groupBy($scope.companies, function(obj) {
            return obj.contactName;
        });
    }
]);
/// App Controller
App.controller('appController',
    ['$rootScope', '$scope', function ($rootScope, $scope) {
}]);
App.controller('CompanyController', ['$scope', '$routeParams', 'companiesService',
    function($scope, $routeParams, companiesService) {
        $scope.company = companiesService.getCompany($routeParams.companyId);

        $scope.editing = $routeParams.editing;

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function(contractId) {
            if (confirm('Are you sure?')) {
                companiesService.removeContract($scope.company.id, contractId);
            }
        };

        $scope.deleteCompany = function() {
            if (confirm('Are you sure?')) {
                companiesService.removeCompany($scope.company);
            }
        };

        $scope.$watch('$scope.company', companiesService.saveCompanyData, true);

    }
]);
App.controller('HomeController', ['$scope', 'companiesService',
    function($scope, /*$firebase,*/ companiesService) {
        /*var ref = new Firebase("https://dazzling-torch-6890.firebaseio.com/data");

        var sync = $firebase(ref);

        // download the data into a local object
        var syncObject = sync.$asObject();

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");*/

        $scope.companies = companiesService.getCompanies();


    }
]);
/* Directives */

App.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
    $routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: 'AddController'});
    $routeProvider.when('/company/:companyId', {templateUrl: 'partials/company.html', controller: 'CompanyController'});
    $routeProvider.when('/contacts', {templateUrl: 'partials/contact.html', controller: 'ContactController'});
    //$routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);