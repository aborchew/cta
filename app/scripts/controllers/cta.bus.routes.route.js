'use strict';

angular.module('ctaApp')
  .controller('BusRoutesRouteCtrl', function ($scope, $route, ctaBusRoutes) {

    var routeId = $route.current.params.route;

    $scope.route = ctaBusRoutes.get(routeId);
    $scope.directions = [];
    $scope.activeDirection = 0;
    $scope.stops = [];

    $scope.toggleDirection = function () {
      if($scope.activeDirection+1 < $scope.directions.length) {
        $scope.activeDirection += 1;
      } else {
        $scope.activeDirection = 0;
      }
      $scope.stops = $scope.directions[$scope.activeDirection].getStops();
    }

    if(!$scope.route) {
      ctaBusRoutes
        .refresh()
        .then(function(){
          $scope.route = ctaBusRoutes.get(routeId)
          getRouteInfo()
        })
    } else {
      getRouteInfo();
    }

    function getRouteInfo () {
      $scope.route
        .refresh()
        .then(function(){
          $scope.directions = $scope.route.get();
          $scope.stops = $scope.directions[$scope.activeDirection].getStops();
          $scope.serviceBulletins = $scope.directions[$scope.activeDirection].getServiceInfo().items;
        })
    }

  });
