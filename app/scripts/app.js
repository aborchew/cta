'use strict';

angular.module('ctaApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngSanitize',
  'snap'
])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/bus/routes', {
        templateUrl: 'views/cta.bus.routes.html',
        controller: 'busRoutesCtrl'
      })
      .when('/favorites', {
        templateUrl: 'views/favorites.html',
        controller: 'FavoritesCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/bus/routes/:route', {
        templateUrl: 'views/cta.bus.routes.route.html',
        controller: 'BusRoutesRouteCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  })

  .run(function ($rootScope) {

    $rootScope.showBulletins = true;

  })
