(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .factory('urlService', urlService);

  /** @ngInject */
  function urlService($log, $http, Restangular, $rootScope, $base64) {

    var service = {
      loginUrlDefault: loginUrlDefault,
      chartUrlPng: chartUrlPng
    };

    return service;

    function loginUrlDefault() {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl($rootScope.loginUrl);
            RestangularConfigurer.setRequestSuffix('');
        });   
    }
    function chartUrlPng() {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRequestSuffix('.png');
            RestangularConfigurer.setDefaultHeaders({ "Content-Type": "image/jpeg" });
        });   
    }
  }
})();