/**
 *   - v1.1.0 - 2014-10-23
 *  (c) 2014 Tom Bran All Rights Reserved
 */ 

var App = angular.module("Codema", [ "ngRoute", "ngCookies" ]);

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
    var companiesList = [], methods = {}, dbCompaniesRecord = null, lsCompaniesList = JSON.parse(window.localStorage.getItem("companiesList")), offlineAmends = JSON.parse(window.localStorage.getItem("offlineAmends")), lsLastModified = window.localStorage.getItem("lastModified");
    function getHighestId() {
        return _.max(companiesList, function(o) {
            return o.id;
        }).id;
    }
    methods.loadCompanyData = function loadCompanyData() {
        dbCompaniesRecord = dbService.getDbCompaniesRecord();
        if (dbCompaniesRecord && dbService.isOnline()) {
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
        if (dbCompaniesRecord && dbService.isOnline()) {
            dbCompaniesRecord.set("data", JSON.stringify(companiesList));
            dbCompaniesRecord.set("lastModified", now);
        }
        window.localStorage.setItem("companiesList", JSON.stringify(companiesList));
        window.localStorage.setItem("lastModified", now);
        if (!dbService.isOnline()) {
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
    methods.removeContactFromCompanies = function removeContactFromCompanies(id) {
        companiesList = _.map(companiesList, function(obj) {
            if (obj.contactId === id) {
                obj.contactId = null;
                obj.contactName = null;
            }
            return obj;
        });
        methods.saveCompanyData();
    };
    $rootScope.$on("dbReady", methods.loadCompanyData);
    if (!dbService.isOnline()) {
        methods.loadCompanyData();
    }
    return methods;
} ]);

App.service("contactsService", [ "$rootScope", "$location", "$timeout", "dbService", function($rootScope, $location, $timeout, dbService) {
    var contactsList = [], methods = {}, dbCompaniesRecord = null, lsContactsList = JSON.parse(window.localStorage.getItem("contactsList")), offlineAmends = JSON.parse(window.localStorage.getItem("offlineAmends")), lsLastModified = window.localStorage.getItem("lastModified");
    function getHighestId() {
        return _.max(contactsList, function(o) {
            return o.id;
        }).id;
    }
    methods.loadContactData = function loadContactData() {
        dbCompaniesRecord = dbService.getDbCompaniesRecord();
        if (dbCompaniesRecord && dbService.isOnline()) {
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
        if (dbCompaniesRecord && dbService.isOnline()) {
            dbCompaniesRecord.set("contacts", JSON.stringify(contactsList));
            dbCompaniesRecord.set("lastModified", now);
        }
        window.localStorage.setItem("contactsList", JSON.stringify(contactsList));
        window.localStorage.setItem("lastModified", now);
        if (!dbService.isOnline()) {
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
    if (!dbService.isOnline()) {
        methods.loadContactData();
    }
    return methods;
} ]);

App.service("dbService", [ "$rootScope", "$timeout", "$cookies", function($rootScope, $timeout, $cookies) {
    var methods = {}, dbCompaniesTable, dbCompanies = [], dbSettings = {
        key: "peo2jcopy5i7qtq"
    }, online = navigator.onLine, dbClient = online ? new Dropbox.Client(dbSettings) : null, dbClientUrl = window.location.href, dbTable = null, dbCompaniesRecord = null, dbCompaniesAry = null, dbLoading = true, dbLoggedIn = false, loginStatusInFlux = false, noModal = false, preferenceIsOffline = $cookies.preferenceIsOffline ? JSON.parse($cookies.preferenceIsOffline) : false, preferenceExpires = $cookies.preferenceExpires ? parseInt($cookies.preferenceExpires, 10) : null;
    function authenticateCallback(err, dbClient) {
        if (dbClient && dbClient.isAuthenticated()) {
            resolveLoginStatus(true);
            resetPreferences();
            openDatastore();
        } else {
            if (!noModal) {
                $rootScope.$broadcast("showAuthModal");
            }
            noModal = false;
        }
    }
    function resolveLoginStatus(bool) {
        $timeout(function() {
            dbLoggedIn = bool;
            loginStatusInFlux = false;
        });
    }
    function dataIsReady() {
        $timeout(function() {
            dbLoading = false;
        });
        $rootScope.$broadcast("dbReady");
    }
    function openDatastore() {
        var datastoreManager = new Dropbox.Datastore.DatastoreManager(dbClient);
        datastoreManager.openDefaultDatastore(function(error, dbDatastore) {
            if (error) {
                console.log("Datastore error: " + error);
                return;
            }
            dbTable = dbDatastore.getTable("allData");
            dbCompaniesAry = dbTable.query();
            setDbCompaniesRecord();
            dataIsReady();
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
    function setupDbAuthDriver() {
        if (!dbClient) {
            return;
        }
        if (dbClientUrl.indexOf("index.html") !== -1) {
            dbClientUrl = dbClientUrl.split("index.html")[0];
        }
        if (dbClientUrl.indexOf("#/") !== -1) {
            dbClientUrl = dbClientUrl.split("#/")[0];
        }
        dbClient.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl: dbClientUrl + "oauth_receiver.html"
        }));
    }
    function checkCookiePreferenceExpiry() {
        var now = new Date().getTime();
        if (preferenceExpires === null || preferenceExpires < now) {
            resetPreferences();
        }
    }
    function resetPreferences() {
        $cookies.preferenceIsOffline = false;
        preferenceIsOffline = false;
    }
    methods.dbAuth = function authenticate(userInitiated) {
        $timeout(function() {
            loginStatusInFlux = true;
            dbLoading = true;
        });
        if (!online || preferenceIsOffline) {
            resolveLoginStatus(false);
            dataIsReady();
            return;
        }
        if (dbClient.authError) {
            dbClient.reset();
        }
        if (userInitiated) {
            dbClient.authenticate(authenticateCallback);
        } else {
            dbClient.authenticate({
                interactive: false
            }, authenticateCallback);
        }
    };
    methods.isDbLoggedIn = function getDbLoggedIn() {
        return dbLoggedIn;
    };
    methods.getDbCompaniesRecord = function getDbCompaniesRecord() {
        return dbCompaniesRecord;
    };
    methods.isLoginStatusInFlux = function isLoginStatusInFlux() {
        return loginStatusInFlux;
    };
    methods.isDbLoading = function isDbLoading() {
        return dbLoading;
    };
    methods.isOnline = function isOnline() {
        return online;
    };
    methods.setOfflinePreference = function setOfflinePreference(bool) {
        preferenceIsOffline = bool;
    };
    methods.dbLogOut = function dbLogOut() {
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
    methods.dbLogIn = function dbLogIn() {
        if (dbClient.authError) {
            dbClient.reset();
        }
        $timeout(function() {
            loginStatusInFlux = true;
        });
        noModal = true;
        dbClient.authenticate(authenticateCallback);
    };
    checkCookiePreferenceExpiry();
    setupDbAuthDriver();
    return methods;
} ]);

App.service("modalService", [ "$rootScope", "$timeout", function($rootScope, $timeout) {
    var methods = {}, modalShown = false, activeModalId = null, hideCloseBtn = false;
    methods.showModal = function showModal(id) {
        $timeout(function() {
            modalShown = true;
        });
        activeModalId = id;
        $rootScope.$broadcast("modalOpened");
    };
    methods.hideModal = function hideModal(force) {
        if (force || !hideCloseBtn) {
            $timeout(function() {
                modalShown = false;
            });
            $rootScope.$broadcast("modalClosed");
        }
    };
    methods.isModalShown = function isModalShown() {
        return modalShown;
    };
    methods.getActiveModalId = function getActiveModalId() {
        return activeModalId;
    };
    methods.setActiveModalId = function setActiveModalId(id) {
        activeModalId = id;
    };
    methods.setCloseBtnHidden = function setCloseBtnHidden(bool) {
        hideCloseBtn = bool;
    };
    methods.isCloseBtnHidden = function isCloseBtnHidden() {
        return hideCloseBtn;
    };
    return methods;
} ]);

App.controller("AddCtrl", [ "appStateService", function(appStateService) {
    appStateService.setCurrentPage("add");
} ]);

App.controller("AppCtrl", [ "$rootScope", "$scope", "$timeout", "$location", "dbService", "contactsService", "companiesService", "modalService", function($rootScope, $scope, $timeout, $location, dbService, contactsService, companiesService, modalService) {
    $scope.isDbLoading = dbService.isDbLoading;
    $scope.companies = companiesService.getCompanies();
    $scope.contacts = contactsService.getContacts();
    $rootScope.$on("showAuthModal", function() {
        $timeout(function() {
            modalService.showModal("promptModal");
        }, 1e3);
    });
    dbService.dbAuth(false);
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

App.controller("CompanyAddCtrl", [ "$rootScope", "$scope", "$timeout", "$location", "contactsService", "companiesService", "appStateService", "modalService", function($rootScope, $scope, $timeout, $location, contactsService, companiesService, appStateService, modalService) {
    appStateService.setCurrentPage("add");
    $scope.type = "companies";
    $scope.isEditing = true;
    $scope.getContact = contactsService.getContact;
    $scope.showModal = modalService.showModal;
    $scope.mode = "new";
    $scope.company = {};
    $scope.company.contracts = [];
    $scope.saveCo = function() {
        if ($scope.coForm.$invalid) {
            alert("Please fix the errors in the form before continuing");
        } else {
            if ($scope.company.contracts) {
                $scope.company.contracts = companiesService.removeEmptyContracts($scope.company.contracts);
            }
            companiesService.addCompany($scope.company);
            $location.path("/" + $scope.type);
        }
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
} ]);

App.controller("CompanyEditCtrl", [ "$rootScope", "$scope", "$routeParams", "$timeout", "$location", "dbService", "contactsService", "companiesService", "appStateService", "modalService", function($rootScope, $scope, $routeParams, $timeout, $location, dbService, contactsService, companiesService, appStateService, modalService) {
    appStateService.setCurrentPage("companies");
    $scope.isEditing = $routeParams.editing;
    $scope.getContact = contactsService.getContact;
    $scope.showModal = modalService.showModal;
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
            $location.path("/" + $scope.type);
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
    $scope.finishEditing = function() {
        if ($scope.coForm.$valid) {
            $location.search("editing", null);
        } else {
            alert("Please fix the errors in the form before continuing");
        }
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

App.controller("ContactAddCtrl", [ "$rootScope", "$scope", "$location", "$timeout", "$routeParams", "contactsService", "appStateService", "modalService", function($rootScope, $scope, $location, $timeout, $routeParams, contactsService, appStateService, modalService) {
    $timeout(function() {
        if (!$scope.inModal) {
            appStateService.setCurrentPage("add");
        }
    });
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
        if ($scope.coForm.$invalid) {
            alert("Please fix the errors in the form before continuing");
        } else {
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
                        modalService.hideModal();
                    });
                } else {
                    $location.path("/" + $scope.type);
                }
            }
        }
    };
    $scope.cancelCo = function() {
        $location.path("/" + $scope.type);
    };
} ]);

App.controller("ContactEditCtrl", [ "$rootScope", "$scope", "$routeParams", "$timeout", "$location", "dbService", "contactsService", "companiesService", "appStateService", function($rootScope, $scope, $routeParams, $timeout, $location, dbService, contactsService, companiesService, appStateService) {
    appStateService.setCurrentPage("contacts");
    $scope.isEditing = $routeParams.editing;
    $scope.id = parseInt($routeParams.contactId);
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
            companiesService.removeContactFromCompanies($scope.id);
            contactsService.removeContact($scope.contact);
            $location.path("/" + $scope.type);
        }
    };
    $scope.finishEditing = function() {
        if ($scope.coForm.$valid) {
            $location.search("editing", null);
        } else {
            alert("Please fix the errors in the form before continuing");
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
    $scope.isLoginStatusInFlux = dbService.isLoginStatusInFlux;
    $scope.dbActive = false;
    $scope.$watch(dbService.isDbLoggedIn, function(newVal, oldVal) {
        $scope.dbActive = newVal;
    });
} ]);

App.controller("PromptCtrl", [ "$rootScope", "$scope", "$cookies", "dbService", "modalService", function($rootScope, $scope, $cookies, dbService, modalService) {
    $scope.yesDb = function() {
        dbService.dbAuth(true);
        modalService.hideModal(true);
    };
    $scope.noDb = function() {
        $cookies.preferenceIsOffline = true;
        dbService.setOfflinePreference(true);
        $cookies.preferenceExpires = new Date().getTime() + 14 * 24 * 60 * 60 * 1e3;
        dbService.dbAuth(true);
        modalService.hideModal(true);
    };
    $scope.maybeLater = function() {
        $cookies.preferenceIsOffline = true;
        dbService.setOfflinePreference(true);
        $cookies.preferenceExpires = new Date().getTime();
        dbService.dbAuth(true);
        modalService.hideModal(true);
    };
} ]);

App.directive("autoFocus", function($timeout) {
    return {
        restrict: "AC",
        link: function(_scope, _element) {
            $timeout(function() {
                _element[0].focus();
            }, 0);
        }
    };
});

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

App.directive("modalDialog", [ "modalService", function(modalService) {
    return {
        restrict: "E",
        scope: false,
        replace: true,
        transclude: true,
        templateUrl: "partials/modal-dialog.html",
        link: function(scope, element, attrs) {
            scope.hideModal = modalService.hideModal;
            scope.isModalShown = modalService.isModalShown;
            scope.getActiveModalId = modalService.getActiveModalId;
            scope.isCloseBtnHidden = modalService.isCloseBtnHidden;
            if (scope.hideModalCloseBtn) {
                modalService.setCloseBtnHidden(true);
            }
        }
    };
} ]);

App.filter("fallbackText", function() {
    return function(str, fallbackStr) {
        if (str === undefined || str.length === 0) {
            return fallbackStr;
        } else {
            return str;
        }
    };
});

App.filter("hideProtocol", function() {
    return function(str) {
        if (str && str.indexOf("http://") !== -1) {
            return str.replace("http://", "");
        } else if (str && str.indexOf("https://") !== -1) {
            return str.replace("https://", "");
        } else {
            return str;
        }
    };
});

App.filter("prettyDate", function() {
    return function(str) {
        if (str === undefined || str.length === 0) {
            return str;
        } else {
            var d = new Date(str);
            return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
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