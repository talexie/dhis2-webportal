(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .factory('loginInterceptor', loginInterceptor);

  /** @ngInject */
  function loginInterceptor($log,$rootScope) {
    return {
    // Send the Authorization header with each request
        'request': function(config) {
            config.headers = config.headers || {};
            var encodedString = btoa($rootScope.username + ":" + $rootScope.password);
            config.headers.Authorization = 'Basic '+ encodedString;
           return config;
        }
    };    
  }
})();
