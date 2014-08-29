'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Codema.services', []).
  service('companiesService', ['$location', function($location) {
    var companiesList = [
        {
            name: 'AKQA',
            id: 1,
            address: '1 St. John\'s Lane, London, EC1M 4BL',
            latlong: '-50,0.5',
            notes: 'Some notes here',
            contactName: 'Hiren Vekaria',
            contactEmail: 'hiren@ecomrecruitement.com',
            contracts: [
                {
                    startDate: '2012-12-12',
                    lengthMonths: 6,
                    renewals: 3,
                    rate: 300
                },
                {
                    startDate: '2013-06-10',
                    lengthMonths: 1,
                    renewals: 0,
                    rate: 320
                }
            ]
        },
        {
            name: 'R/GA',
            id: 2,
            address: '2 St. John\'s Lane, London, EC1M 4BL',
            latlong: '-50,0.6',
            notes: 'Some notes here',
            contactName: 'Dev Vadgama',
            contactEmail: 'dev@purple-consultancy.com',
            contracts: [
                {
                    startDate: '2012-12-12',
                    lengthMonths: 3,
                    renewals: 2,
                    rate: 320
                },
                {
                    startDate: '2013-06-10',
                    lengthMonths: 1,
                    renewals: 0,
                    rate: 350
                }
            ]
        }
    ];

    var addCompany = function(newCompany) {
        newCompany.id = companiesList[companiesList.length-1].id + 1;
        companiesList.push(newCompany);
    }

    var getCompanies = function(){
        return companiesList;
    }

    var getCompany = function(id){
        id = parseInt(id, 10);

        return _.find(companiesList, function(co) {
            return _.isEqual(co.id, id);
        });
    }

    var removeCompany = function(company) {
        if (company) {
            companiesList = _.without(companiesList, company);
            // redirect to homepage
            $location.path('/home');
        }
    };

    var removeContract = function(companyId, contractId) {
        getCompany(companyId).contracts.splice(id,1);
    };

    return {
      addCompany: addCompany,
      getCompanies: getCompanies,
      getCompany: getCompany,
      removeCompany: removeCompany
    };

  }]);
