'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Codema.services', []).
  service('companiesService', function() {
    var companiesList = [
        {
            name: 'AKQA',
            address: '1 St. John\'s Lane, London, EC1M 4BL',
            latlong: '-50,0.5',
            notes: 'Some notes here',
            contactName: 'Hiren Vekaria',
            contactEmail: 'hiren@ecomrecruitement.com',
            contracts: [
                {
                    startDate: '12/12/12',
                    lengthMonths: '6',
                    renewals: '3',
                    rate: '400'
                },
                {
                    startDate: '06/10/13',
                    lengthMonths: '1',
                    renewals: '0',
                    rate: '420'
                }
            ]
        },
    ];

    var addCompany = function(newObj) {
        companiesList.push(newObj);
    }

    var getCompanies = function(){
        return companiesList;
    }

    return {
      addCompany: addCompany,
      getCompanies: getCompanies
    };

  });
