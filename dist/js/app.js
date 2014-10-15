/**
 *   - v0.1.0 - 2014-10-15
 *  (c) 2014 Tom Bran All Rights Reserved
 */ 

var App = angular.module("Codema", [ "ngRoute" ]);

App.run([ "$rootScope", "$routeParams", "dbService", "companiesService", function($rootScope, $routeParams, dbService, companiesService) {
    $rootScope.companies = companiesService.getCompanies();
    $rootScope.isLoading = false;
    $rootScope.isLoginStateInFlux = false;
    $rootScope.logout = dbService.dbLogout;
    $rootScope.login = dbService.dbLogin;
    $rootScope.dbActive = false;
    $rootScope.$watch(dbService.getDbLoginStatus, function(newVal, oldVal) {
        $rootScope.dbActive = newVal;
    });
    $rootScope.$watch(companiesService.getCompanies, function(newVal) {
        $rootScope.companies = newVal;
    }, true);
} ]);

App.service("companiesService", [ "$rootScope", "$location", "$timeout", "dbService", function($rootScope, $location, $timeout, dbService) {
    var companiesList = [], methods = {}, dbCompaniesList = null;
    methods.loadCompanyData = function loadCompanyData() {
        dbCompaniesList = dbService.getDbCompaniesList();
        if (navigator.onLine && dbCompaniesList) {
            $timeout(function() {
                companiesList = JSON.parse(dbCompaniesList.get("data"));
            });
        } else {
            var list = window.localStorage.getItem("companiesList");
            if (Modernizr.localstorage && list) {
                $timeout(function() {
                    companiesList = JSON.parse(window.localStorage.getItem("companiesList"));
                });
            }
        }
    };
    methods.saveCompanyData = function saveCompanyData() {
        console.log("saving company data");
        if (navigator.onLine && dbCompaniesList) {
            dbCompaniesList.set("data", JSON.stringify(companiesList));
        }
        window.localStorage.setItem("companiesList", JSON.stringify(companiesList));
    };
    methods.addCompany = function addCompany(newCompany) {
        if (companiesList && companiesList.length) {
            newCompany.id = companiesList[companiesList.length - 1].id + 1;
        } else {
            newCompany.id = 1;
        }
        companiesList.push(newCompany);
        methods.saveCompanyData();
    };
    methods.getCompanies = function getCompanies() {
        return companiesList;
    };
    methods.getCompany = function getCompany(id) {
        id = parseInt(id, 10);
        return _.find(companiesList, function(co) {
            return _.isEqual(co.id, id);
        });
    };
    methods.removeCompany = function removeCompany(company) {
        if (company) {
            companiesList = _.without(companiesList, company);
            $location.path("/home");
        }
        methods.saveCompanyData();
    };
    methods.removeContract = function removeContract(companyId, contractId) {
        methods.getCompany(companyId).contracts.splice(contractId, 1);
    };
    $rootScope.$on("dbReady", methods.loadCompanyData);
    return methods;
} ]);

App.service("dbService", [ "$rootScope", "$timeout", function($rootScope, $timeout) {
    var methods = {}, dbCompaniesTable, dbCompanies = [], dbSettings = {
        key: "peo2jcopy5i7qtq"
    }, dbClient = new Dropbox.Client(dbSettings), dbClientUrl = window.location.href, dbTable = null, dbCompaniesList = null, dbCompaniesAry = null, dbLoginStatus = false;
    function updateAuthenticationStatus(err, dbClient) {
        if (dbClient && dbClient.isAuthenticated()) {
            console.log("auth");
            $timeout(function() {
                dbLoginStatus = true;
                $rootScope.isLoginStateInFlux = false;
            });
            dbIsLoggedIn();
        } else {
            console.log("not auth");
            $timeout(function() {
                dbLoginStatus = false;
                $rootScope.isLoading = false;
                $rootScope.isLoginStateInFlux = false;
            });
            $rootScope.$broadcast("dbReady");
        }
    }
    function dbIsLoggedIn() {
        var datastoreManager = new Dropbox.Datastore.DatastoreManager(dbClient);
        datastoreManager.openDefaultDatastore(function(error, dbDatastore) {
            if (error) {
                console.log("Datastore error: " + error);
                return;
            }
            dbTable = dbDatastore.getTable("allData");
            dbCompaniesAry = dbTable.query();
            setDbCompaniesList();
            $rootScope.$broadcast("dbReady");
            $rootScope.isLoading = false;
        });
    }
    function setDbCompaniesList() {
        if (!dbCompaniesAry.length) {
            dbCompaniesList = dbTable.insert({
                data: JSON.stringify($rootScope.companiesList),
                created: new Date()
            });
        } else {
            dbCompaniesList = dbCompaniesAry[0];
        }
    }
    function init() {
        $timeout(function() {
            $rootScope.isLoginStateInFlux = true;
        });
        if (dbClientUrl.indexOf("index.html") !== -1) {
            dbClientUrl = dbClientUrl.split("index.html")[0];
        }
        if (dbClientUrl.indexOf("#/") !== -1) {
            dbClientUrl = dbClientUrl.split("#/")[0];
        }
        dbClient.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl: dbClientUrl + "oauth_receiver.html"
        }));
        if (navigator.onLine) {
            $timeout(function() {
                $rootScope.isLoading = true;
            });
            dbClient.authenticate(updateAuthenticationStatus);
        } else {
            updateAuthenticationStatus();
        }
    }
    methods.getDbLoginStatus = function getDbLoginStatus() {
        return dbLoginStatus;
    };
    methods.getDbCompaniesList = function getDbCompaniesList() {
        return dbCompaniesList;
    };
    methods.dbLogout = function dropboxLogout() {
        console.log("now");
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
    init();
    return methods;
} ]);

App.controller("AddController", [ "$rootScope", "$scope", "companiesService", function($rootScope, $scope, companiesService) {
    $rootScope.page = "add";
    $scope.mode = "new";
    $scope.isEditing = true;
    $scope.company = {};
    $scope.company.contracts = [];
    $scope.saveCompany = function() {
        companiesService.addCompany($scope.company);
    };
    $scope.addContract = function() {
        $scope.company.contracts.push({});
    };
    $scope.removeContract = function($index) {
        if (confirm("Are you sure?")) {
            $scope.company.contracts.splice($index, 1);
        }
    };
} ]);

App.controller("appController", [ "$rootScope", "$scope", function($rootScope, $scope) {} ]);

App.controller("CompanyController", [ "$rootScope", "$scope", "$routeParams", "companiesService", function($rootScope, $scope, $routeParams, companiesService) {
    $rootScope.page = "company";
    if ($routeParams.companyId) {
        $scope.mode = "show";
    }
    if ($routeParams.editing) {
        $scope.isEditing = true;
    }
    $scope.company = companiesService.getCompany($routeParams.companyId);
    $scope.$watch(companiesService.getCompanies, function(newVal, oldVal) {
        $scope.company = companiesService.getCompany($routeParams.companyId);
    }, true);
    $scope.addContract = function() {
        $scope.company.contracts.push({});
    };
    $scope.removeContract = function(contractId) {
        if (confirm("Are you sure?")) {
            companiesService.removeContract($scope.company.id, contractId);
        }
    };
    $scope.deleteCompany = function() {
        if (confirm("Are you sure?")) {
            companiesService.removeCompany($scope.company);
        }
    };
    $scope.$watch("$scope.company", companiesService.saveCompanyData, true);
} ]);

App.controller("ContactController", [ "$rootScope", "$scope", "companiesService", function($rootScope, $scope, companiesService) {
    $rootScope.page = "contacts";
    $rootScope.$watch(companiesService.getCompanies, setContactData, true);
    function setContactData() {
        $scope.companiesWithContact = _.filter($rootScope.companies, function(obj) {
            return obj.contactName;
        });
        $scope.companiesNotDisplayed = $rootScope.companies.length - $scope.companiesWithContact.length;
        $scope.hasContactsWithoutContact = !!$scope.companiesNotDisplayed;
        if ($scope.companiesNotDisplayed === 1) {
            $scope.companiesSuffix = "y";
            $scope.companiesDescriptor = "is";
        } else {
            $scope.companiesSuffix = "ies";
            $scope.companiesDescriptor = "are";
        }
        $scope.contacts = _.uniq(_.pluck($scope.companiesWithContact, "contactName"));
        $scope.companiesByContact = _.groupBy($scope.companiesWithContact, function(obj) {
            return obj.contactName;
        });
    }
} ]);

App.controller("HomeController", [ "$rootScope", "$scope", function($rootScope, $scope) {
    $rootScope.page = "home";
} ]);

App.directive("dbControls", function() {
    return {
        restrict: "E",
        replace: "true",
        scope: true,
        templateUrl: "../partials/db-controls.html"
    };
});

App.directive("editBar", function() {
    return {
        restrict: "E",
        replace: "true",
        scope: true,
        templateUrl: "../partials/edit-bar.html",
        link: function(scope, elem, attrs) {
            scope.pos = attrs.pos;
        }
    };
});

App.config([ "$routeProvider", function($routeProvider) {
    $routeProvider.when("/home", {
        templateUrl: "partials/home.html",
        controller: "HomeController"
    });
    $routeProvider.when("/company/add", {
        templateUrl: "partials/company.html",
        controller: "AddController"
    });
    $routeProvider.when("/company/:companyId", {
        templateUrl: "partials/company.html",
        controller: "CompanyController"
    });
    $routeProvider.when("/contacts", {
        templateUrl: "partials/contact.html",
        controller: "ContactController"
    });
    $routeProvider.otherwise({
        redirectTo: "/home"
    });
} ]);