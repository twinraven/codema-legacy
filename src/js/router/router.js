App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: 'AddCtrl'});
    $routeProvider.when('/companies', {templateUrl: 'partials/company-list.html', controller: 'CompanyListCtrl'});
    $routeProvider.when('/companies/add', {templateUrl: 'partials/company-form.html', controller: 'CompanyAddCtrl'});
    $routeProvider.when('/companies/:companyId', {templateUrl: 'partials/company-form.html', controller: 'CompanyEditCtrl'});
    $routeProvider.when('/contacts', {templateUrl: 'partials/contact-list.html', controller: 'ContactListCtrl'});
    $routeProvider.when('/contacts/add', {templateUrl: 'partials/contact-form.html', controller: 'ContactAddCtrl'});
    $routeProvider.when('/contacts/:contactId', {templateUrl: 'partials/contact-form.html', controller: 'ContactEditCtrl'});

    //$routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapCtrl'});
    $routeProvider.otherwise({redirectTo: '/companies'});
}]);