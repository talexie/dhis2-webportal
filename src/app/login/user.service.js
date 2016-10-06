(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .factory('userService', userService);

  /** @ngInject */
  function userService($log, Restangular) {

    var service = {
        getUserDetails: getUserDetails
    };

    return service;
    function getUserDetails(){
        Restangular.one('me').get().then(function(data){
            //$log.info("User details " + angular.toJson(data));
            return data;
        });
    }

  }
})();
