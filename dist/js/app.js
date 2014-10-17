/**
 *   - v1.1.0 - 2014-10-17
 *  (c) 2014 Tom Bran All Rights Reserved
 */ 

var App = angular.module("Codema", [ "ngRoute" ]);

App.service("appStateService", [ "$rootScope", function($rootScope) {
    var methods = {}, currentPage = null;
    methods.getCurrentPage = function getCurrentPage() {
        return currentPage;
    };
    methods.setCurrentPage = function setCurrentPage(page) {
        currentPage = page;
    };
    return methods;
} ]);

App.service("companiesService", [ "$rootScope", "$location", "$timeout", "dbService", function($rootScope, $location, $timeout, dbService) {
    var companiesList = [], methods = {}, dbCompaniesRecord = null, lsCompaniesList = JSON.parse(window.localStorage.getItem("companiesList")), offlineAmends = JSON.parse(window.localStorage.getItem("offlineAmends")), lsLastModified = window.localStorage.getItem("lastModified"), online = navigator.onLine;
    function getHighestId() {
        return _.max(companiesList, function(o) {
            return o.id;
        }).id;
    }
    methods.loadCompanyData = function loadCompanyData() {
        dbCompaniesRecord = dbService.getDbCompaniesRecord();
        if (dbCompaniesRecord && online) {
            $timeout(function() {
                var dbCompaniesList = JSON.parse(dbCompaniesRecord.get("data")), dbLastModified = dbCompaniesRecord.get("lastModified");
                if (offlineAmends && dbLastModified !== lsLastModified) {
                    if (confirm("You've changed some company data whilst offline: would you like to upload these now? This will overwrite your online data.\n\nClick 'OK' to use your local data;\nClick 'Cancel' to use the version stored online")) {
                        companiesList = lsCompaniesList;
                        methods.saveCompanyData();
                    } else {
                        companiesList = dbCompaniesList;
                    }
                    window.localStorage.setItem("offlineAmends", false);
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
        var now = new Date().toUTCString();
        if (dbCompaniesRecord && online) {
            dbCompaniesRecord.set("data", JSON.stringify(companiesList));
            dbCompaniesRecord.set("lastModified", now);
        }
        window.localStorage.setItem("companiesList", JSON.stringify(companiesList));
        window.localStorage.setItem("lastModified", now);
        if (!online) {
            window.localStorage.setItem("offlineAmends", true);
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
    methods.getCompanies = function getCompanies() {
        return companiesList;
    };
    methods.getCompany = function getCompany(id) {
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
            $location.path("/companies");
        }
        methods.saveCompanyData();
    };
    methods.removeContract = function removeContract(companyId, contractId) {
        methods.getCompany(companyId).contracts.splice(contractId, 1);
    };
    methods.removeEmptyContracts = function removeEmptyContracts(contracts) {
        if (contracts.length === 0) {
            return contracts;
        }
        var c, x = 0, y;
        for (y = contracts.length; x < y; x++) {
            c = contracts[x];
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
    $rootScope.$on("dbReady", methods.loadCompanyData);
    if (!online) {
        methods.loadCompanyData();
    }
    return methods;
} ]);

App.service("contactsService", [ "$rootScope", "$location", "$timeout", "dbService", function($rootScope, $location, $timeout, dbService) {
    var contactsList = [], methods = {}, dbCompaniesRecord = null, lsContactsList = JSON.parse(window.localStorage.getItem("contactsList")), offlineAmends = JSON.parse(window.localStorage.getItem("offlineAmends")), lsLastModified = window.localStorage.getItem("lastModified"), online = navigator.onLine;
    function getHighestId() {
        return _.max(contactsList, function(o) {
            return o.id;
        }).id;
    }
    methods.loadContactData = function loadContactData() {
        dbCompaniesRecord = dbService.getDbCompaniesRecord();
        if (dbCompaniesRecord && online) {
            $timeout(function() {
                var dbContactsList = JSON.parse(dbCompaniesRecord.get("contacts")), dbLastModified = dbCompaniesRecord.get("lastModified");
                if (offlineAmends && dbLastModified !== lsLastModified) {
                    if (confirm("You've changed some contact data whilst offline: would you like to upload these now? This will overwrite your online data.\n\nClick 'OK' to use your local data;\nClick 'Cancel' to use the version stored online")) {
                        contactsList = lsContactsList;
                        methods.saveContactData();
                    } else {
                        contactsList = dbContactsList;
                    }
                    window.localStorage.setItem("offlineAmends", false);
                } else {
                    contactsList = dbContactsList;
                }
            });
        } else {
            if (Modernizr.localstorage && lsContactsList) {
                $timeout(function() {
                    contactsList = lsContactsList;
                });
            }
        }
    };
    methods.saveContactData = function saveContactData() {
        var now = new Date().toUTCString();
        if (dbCompaniesRecord && online) {
            dbCompaniesRecord.set("contacts", JSON.stringify(contactsList));
            dbCompaniesRecord.set("lastModified", now);
        }
        window.localStorage.setItem("contactsList", JSON.stringify(contactsList));
        window.localStorage.setItem("lastModified", now);
        if (!online) {
            window.localStorage.setItem("offlineAmends", true);
        }
    };
    methods.addContact = function addContact(newContact) {
        if (contactsList && contactsList.length) {
            newContact.id = getHighestId() + 1;
        } else {
            newContact.id = 1;
        }
        contactsList.push(newContact);
        methods.saveContactData();
    };
    methods.getContacts = function getContacts() {
        return contactsList;
    };
    methods.getContact = function getContact(id) {
        id = parseInt(id, 10);
        return _.find(contactsList, function(co) {
            return _.isEqual(co.id, id);
        });
    };
    methods.removeContact = function removeContact(contact) {
        if (contact) {
            contactsList = _.without(contactsList, contact);
            $location.path("/companies");
        }
        methods.saveContactData();
    };
    $rootScope.$on("dbReady", methods.loadContactData);
    if (!online) {
        methods.loadContactData();
    }
    return methods;
} ]);

App.service("dbService", [ "$rootScope", "$timeout", function($rootScope, $timeout) {
    var methods = {}, dbCompaniesTable, dbCompanies = [], dbSettings = {
        key: "peo2jcopy5i7qtq"
    }, online = navigator.onLine, dbClient = online ? new Dropbox.Client(dbSettings) : null, dbClientUrl = window.location.href, dbTable = null, dbCompaniesRecord = null, dbCompaniesAry = null, dbLoading = true, dbLoggedIn = false, loginStatusInFlux = true;
    function updateAuthenticationStatus(err, dbClient) {
        if (dbClient && dbClient.isAuthenticated()) {
            console.log("auth");
            $timeout(function() {
                dbLoggedIn = true;
                loginStatusInFlux = false;
            });
            dbIsLoggedIn();
        } else {
            console.log("not auth");
            $timeout(function() {
                dbLoggedIn = false;
                dbLoading = false;
                loginStatusInFlux = false;
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
            setDbCompaniesRecord();
            $rootScope.$broadcast("dbReady");
            dbLoading = false;
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
        if (dbClientUrl.indexOf("index.html") !== -1) {
            dbClientUrl = dbClientUrl.split("index.html")[0];
        }
        if (dbClientUrl.indexOf("#/") !== -1) {
            dbClientUrl = dbClientUrl.split("#/")[0];
        }
        if (online) {
            dbClient.authDriver(new Dropbox.AuthDriver.Popup({
                receiverUrl: dbClientUrl + "oauth_receiver.html"
            }));
            $timeout(function() {
                dbLoading = true;
            });
            dbClient.authenticate(updateAuthenticationStatus);
        } else {
            updateAuthenticationStatus();
        }
    }
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
    };
    methods.dbLogOut = function dropboxLogout() {
        console.log("now");
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
    initDb();
    return methods;
} ]);

App.controller("AddCtrl", [ "appStateService", function(appStateService) {
    appStateService.setCurrentPage("add");
} ]);

App.controller("AppCtrl", [ "$rootScope", "$scope", "dbService", "contactsService", "companiesService", function($rootScope, $scope, dbService, contactsService, companiesService) {
    $scope.isDbLoading = dbService.isDbLoading;
    $scope.companies = companiesService.getCompanies();
    $scope.contacts = contactsService.getContacts();
    $scope.$watch(companiesService.getCompanies, function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.companies = newVal;
            $scope.$broadcast("dbCompaniesUpdated");
        }
    }, true);
    $scope.$watch(contactsService.getContacts, function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.contacts = newVal;
            $scope.$broadcast("dbContactsUpdated");
        }
    }, true);
} ]);

App.controller("CompanyAddCtrl", [ "$rootScope", "$scope", "$timeout", "$location", "contactsService", "companiesService", "appStateService", function($rootScope, $scope, $timeout, $location, contactsService, companiesService, appStateService) {
    appStateService.setCurrentPage("add");
    $scope.type = "companies";
    $scope.isEditing = true;
    $scope.getContact = contactsService.getContact;
    $scope.mode = "new";
    $scope.company = {};
    $scope.company.contracts = [];
    $scope.saveCo = function() {
        if ($scope.company.contracts) {
            $scope.company.contracts = companiesService.removeEmptyContracts($scope.company.contracts);
        }
        companiesService.addCompany($scope.company);
        $location.path("/" + $scope.type);
    };
    $scope.cancelCo = function() {
        $location.path("/" + $scope.type);
    };
    $scope.addContract = function() {
        $scope.company.contracts.push({});
    };
    $scope.removeContract = function($index) {
        if (confirm("Are you sure?")) {
            $scope.company.contracts.splice($index, 1);
        }
    };
    $scope.selectContact = function(id) {
        $scope.company.contactId = id;
        $scope.company.contactName = $scope.getContact(id).name;
        $scope.showContactList = false;
    };
    $scope.delayBlur = function() {
        $timeout(function() {
            $scope.showContacts = false;
        }, 250);
    };
    $scope.hideModal = function() {
        $scope.setDialogShown(false);
    };
} ]);

App.controller("CompanyEditCtrl", [ "$rootScope", "$scope", "$routeParams", "$timeout", "dbService", "contactsService", "companiesService", "appStateService", function($rootScope, $scope, $routeParams, $timeout, dbService, contactsService, companiesService, appStateService) {
    appStateService.setCurrentPage("company");
    $scope.isEditing = $routeParams.editing;
    $scope.getContact = contactsService.getContact;
    $scope.id = $routeParams.companyId;
    $scope.type = "companies";
    $scope.mode = "show";
    $scope.$on("dbCompaniesUpdated", setCompanyData);
    if (!dbService.isDbLoading()) {
        setCompanyData();
    }
    function setCompanyData() {
        $scope.company = companiesService.getCompany($routeParams.companyId);
    }
    $scope.addContract = function() {
        $scope.company.contracts.push({});
    };
    $scope.removeContract = function(contractId) {
        if (confirm("Are you sure?")) {
            companiesService.removeContract($scope.company.id, contractId);
        }
    };
    $scope.deleteCo = function() {
        if (confirm("Are you sure?")) {
            companiesService.removeCompany($scope.company);
        }
    };
    $scope.selectContact = function(id) {
        $timeout(function() {
            $scope.company.contactId = id;
            $scope.company.contactName = $scope.getContact(id).name;
        });
        $scope.showContactList = false;
    };
    $scope.delayBlur = function() {
        $timeout(function() {
            $scope.showContacts = false;
        }, 250);
    };
    $scope.$watch("$scope.company", function() {
        if ($scope.company) {
            companiesService.saveCompanyData();
            if ($scope.company.contracts) {
                $scope.company.contracts = companiesService.removeEmptyContracts($scope.company.contracts);
            }
        }
    }, true);
} ]);

App.controller("CompanyListCtrl", [ "$scope", "$routeParams", "appStateService", "contactsService", function($scope, $routeParams, appStateService, contactsService) {
    appStateService.setCurrentPage("companies");
    $scope.getContact = contactsService.getContact;
    $scope.filterText = $routeParams.search;
} ]);

App.controller("ContactAddCtrl", [ "$rootScope", "$scope", "$location", "$timeout", "$routeParams", "contactsService", "appStateService", function($rootScope, $scope, $location, $timeout, $routeParams, contactsService, appStateService) {
    appStateService.setCurrentPage("add");
    $scope.type = "contacts";
    $scope.isEditing = true;
    $scope.mode = "new";
    $scope.contact = {};
    function isDuplicateName(contacts, name) {
        return _.find(contacts, function(co) {
            return _.isEqual(co.name, name);
        });
    }
    $rootScope.$on("modalClosed", function() {
        $scope.contact = {};
    });
    $scope.saveCo = function() {
        var contacts = contactsService.getContacts();
        if (isDuplicateName(contacts, $scope.contact.name)) {
            if (confirm("You already have a contact by this name.\n\nClick 'OK' to continue anyway;\nClick 'Cancel' to edit this contact.")) {
                contactsService.addContact($scope.contact);
                $location.path("/" + $scope.type);
            } else {
                return false;
            }
        } else {
            contactsService.addContact($scope.contact);
            if ($scope.inModal) {
                $timeout(function() {
                    $rootScope.hideModal();
                });
            } else {
                $location.path("/" + $scope.type);
            }
        }
    };
    $scope.cancelCo = function() {
        $location.path("/" + $scope.type);
    };
} ]);

App.controller("ContactEditCtrl", [ "$rootScope", "$scope", "$routeParams", "$timeout", "dbService", "contactsService", "appStateService", function($rootScope, $scope, $routeParams, $timeout, dbService, contactsService, appStateService) {
    appStateService.setCurrentPage("contacts");
    $scope.isEditing = $routeParams.editing;
    $scope.id = $routeParams.contactId;
    $scope.type = "contacts";
    $scope.mode = "show";
    $scope.$on("dbContactsUpdated", setContactData);
    if (!dbService.isDbLoading()) {
        setContactData();
    }
    function setContactData() {
        $scope.contact = contactsService.getContact($routeParams.contactId);
    }
    $scope.deleteCo = function() {
        if (confirm("Are you sure?")) {
            contactsService.removeContact($scope.contact);
        }
    };
    $scope.$watch("$scope.contact", contactsService.saveContactData, true);
} ]);

App.controller("ContactListCtrl", [ "$rootScope", "$scope", "$routeParams", "dbService", "contactsService", "companiesService", "appStateService", function($rootScope, $scope, $routeParams, dbService, contactsService, companiesService, appStateService) {
    appStateService.setCurrentPage("contacts");
    $scope.contactId = $routeParams.contactId;
    $scope.getCompaniesByContact = companiesService.getCompaniesByContact;
    $scope.$on("dbCompaniesUpdated", setContactData);
    if (!dbService.isDbLoading()) {
        setContactData();
    }
    function setContactData() {
        $scope.companiesWithContact = companiesService.getCompaniesWithContact();
        $scope.contacts = contactsService.getContacts();
    }
    $scope.getSuffix = function(num) {
        if (num === 1) {
            return "y";
        } else {
            return "ies";
        }
    };
} ]);

App.controller("DbControlsCtrl", [ "$rootScope", "$scope", "dbService", function($rootScope, $scope, dbService) {
    $scope.logout = dbService.dbLogOut;
    $scope.login = dbService.dbLogIn;
    $scope.isOnline = dbService.isOnline;
    $scope.dbActive = false;
    $scope.$watch(dbService.isDbLoggedIn, function(newVal, oldVal) {
        $scope.dbActive = newVal;
    });
} ]);

App.controller("ModalDialogCtrl", [ "$rootScope", "$scope", "$timeout", function($rootScope, $scope, $timeout) {
    $scope.modalShown = false;
    $rootScope.showModal = function() {
        $timeout(function() {
            $scope.modalShown = true;
        });
        $rootScope.$broadcast("modalOpened");
    };
    $rootScope.hideModal = function() {
        $timeout(function() {
            $scope.modalShown = false;
        });
        $rootScope.$broadcast("modalClosed");
    };
} ]);

App.directive("dbControls", function() {
    return {
        controller: "DbControlsCtrl",
        restrict: "E",
        replace: "true",
        scope: true,
        templateUrl: "partials/db-controls.html"
    };
});

App.directive("editBar", function() {
    return {
        restrict: "E",
        replace: "true",
        scope: true,
        templateUrl: "partials/edit-bar.html",
        link: function(scope, elem, attrs) {
            scope.pos = attrs.pos;
        }
    };
});

App.directive("headerBar", [ "appStateService", function(appStateService) {
    return {
        restrict: "E",
        replace: "true",
        scope: true,
        templateUrl: "partials/header-bar.html",
        link: function(scope, elem, attrs) {
            scope.getCurrentPage = appStateService.getCurrentPage;
        }
    };
} ]);

App.directive("modalDialog", function() {
    return {
        restrict: "E",
        scope: true,
        replace: true,
        transclude: true,
        controller: "ModalDialogCtrl",
        templateUrl: "partials/modal-dialog.html",
        link: function(scope, element, attrs) {}
    };
});

App.filter("fallbackText", function() {
    return function(str, fallbackStr) {
        if (str === undefined || str.length === 0) {
            return fallbackStr;
        } else {
            return str;
        }
    };
});

App.filter("useDashIfEmpty", function() {
    return function(str) {
        if (str === undefined || str.length === 0) {
            return "–";
        } else {
            return str;
        }
    };
});

App.config([ "$routeProvider", function($routeProvider) {
    $routeProvider.when("/add", {
        templateUrl: "partials/add.html",
        controller: "AddCtrl"
    });
    $routeProvider.when("/companies", {
        templateUrl: "partials/company-list.html",
        controller: "CompanyListCtrl"
    });
    $routeProvider.when("/companies/add", {
        templateUrl: "partials/company-form.html",
        controller: "CompanyAddCtrl"
    });
    $routeProvider.when("/companies/:companyId", {
        templateUrl: "partials/company-form.html",
        controller: "CompanyEditCtrl"
    });
    $routeProvider.when("/contacts", {
        templateUrl: "partials/contact-list.html",
        controller: "ContactListCtrl"
    });
    $routeProvider.when("/contacts/add", {
        templateUrl: "partials/contact-form.html",
        controller: "ContactAddCtrl"
    });
    $routeProvider.when("/contacts/:contactId", {
        templateUrl: "partials/contact-form.html",
        controller: "ContactEditCtrl"
    });
    $routeProvider.otherwise({
        redirectTo: "/companies"
    });
} ]);