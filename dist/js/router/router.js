App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
    $routeProvider.when('/company/add', {templateUrl: 'partials/company.html', controller: 'AddController'});
    $routeProvider.when('/company/:companyId', {templateUrl: 'partials/company.html', controller: 'CompanyController'});
    $routeProvider.when('/contacts', {templateUrl: 'partials/contact.html', controller: 'ContactController'});
    //$routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);