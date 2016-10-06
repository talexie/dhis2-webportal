(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$location,Restangular,$cacheFactory,$rootScope) {
  	$rootScope.$on('$stateChangeSuccess',function(event,toState,toParams,fromState,fromParams){      
     	$cacheFactory.get('$http').removeAll();
    });
    $rootScope.username = 'admin';
    $rootScope.password = 'district';
    //$rootScope.authorized = { Authorization: "Basic " + $rootScope.encoded };
    var baseInstance = '';
    var baseHost = $location.host();
    var basePort = $location.port();
    var baseProtocol = $location.protocol();
    var basePath = $location.absUrl();
    var baseInstancePath = basePath.split('/',7);
    var instance = 'dhis';
    if((baseInstancePath.indexOf('dhis-web-')) >= 0){
      baseInstance = '';
    }
    else{
      baseInstance = baseInstancePath[3];
    }
    
    //var newBaseUrl = baseProtocol + '://' + baseHost + ':' + basePort + '/' + instance;
    var newBaseUrl = baseProtocol + '://' + baseHost + '/' + instance;
    var baseUrl = [newBaseUrl,'api'].join('/');
    $rootScope.loginUrl = baseProtocol + '://' + baseHost + '/' + instance;
    Restangular.setBaseUrl(baseUrl);
    Restangular.setRequestSuffix('.json');
    Restangular.setDefaultHttpFields({cache: false}); 
    $log.debug('Server Instance details loaded' + baseUrl);
  }

})();
