var isMobile = (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) !== null) ? true : false;

angular.module('ctaApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'snap'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/bus', {
        templateUrl: 'views/bus.html',
        controller: 'BusCtrl'
      })
      .when('/train', {
        templateUrl: 'views/train.html',
        controller: 'TrainCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/favorites', {
        templateUrl: 'views/favorites.html',
        controller: 'FavoritesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', function ($rootScope) {

  }])

$(document).ready(function () {

  function onDeviceReady() {
    angular.bootstrap(angular.element('body'), ['ctaApp']);
    if (isMobile && window.device && parseInt(window.device.version) === 7) {
      $('body').addClass('ios7');
    }
  }

  if (isMobile) {
    document.addEventListener("deviceready", onDeviceReady, false);
  } else {
    onDeviceReady();
  }

})
