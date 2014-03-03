'use strict';

angular.module('ctaApp')
  .factory('ctaYqlRequest', function ($http, $q) {
    // Service logic

    var ctaUrl
      , yqlUrl
      , ctaKey
      ;

    ctaUrl = 'http://www.ctabustracker.com/bustime/api/v1/';
    yqlUrl = 'http://query.yahooapis.com/v1/public/yql?q=select * from xml where url=\'';
    ctaKey = 'rHY3JsWPQvFBerftmPfPGGdzZ';

    function getUrl (service,params) {
      params.key = ctaKey;
      params = '?' + encodeURIComponent($.param(params)) + '\'&format=json';
      return yqlUrl + ctaUrl + service + params;
    }

    function get (service, params) {

      if(!service) {
        throw new Error('Service name was not specified')
      }

      if(!params || typeof params !== 'object') {
        params = {};
      };

      return $http({
        url: getUrl(service, params),
        method: 'GET',
        timeout: 5000,
        cache: false,
        transformResponse: function(data) {
          return angular.fromJson(data).query.results['bustime-response'];
        }
      });

    }

    // Public API
    return {
      get: get
    };

  });
