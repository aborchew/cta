'use strict';

angular.module('ctaApp', [
  'ngRoute'
  , 'ui.bootstrap'
  , 'firebase'
])

  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          routes: function ($http) {
            return $http.get('https://ctabustracker.firebaseio.com/routes.json');
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  })

  .run(function ($rootScope) {

  })
