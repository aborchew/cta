'use strict';

angular.module('ctaApp')
  .controller('BusStopsStopCtrl', function ($scope, $route, $filter, ctaBusRoutes) {

    var routeId
      , stopId
      ;

    $scope.predictions = [];
    $scope.direction = $route.current.params.direction;

    routeId = $route.current.params.route;
    stopId = $route.current.params.stop;

    function findStop () {
      var stops = $filter('filter')(ctaBusRoutes.get(routeId).get(),{direction:$scope.direction});
      if(stops.length != 1) {
        throw new Error('Could not find matching stop direction.');
      }
      stops = stops[0].getStops();
      var stop = $filter('filter')(stops,{stopId:stopId});
      if(stop.length != 1) {
        throw new Error('Could not find matching stop ID.');
      }
      $scope.stop = stop[0];
      $scope.stop
        .refresh()
        .then(function () {
          $scope.predictions = $scope.stop.get();
        })
    }

    if(!ctaBusRoutes.get().length) {
      ctaBusRoutes
        .refresh()
        .then(function () {
          ctaBusRoutes
            .get(routeId)
              .refresh()
              .then(function () {
                findStop();
              });
        })
    } else {
      findStop();
    }

    $scope.refreshPredictions = function () {
      $scope.predictions = [];
      $scope.stop
        .refresh()
        .then(function () {
          $scope.predictions = $scope.stop.get();
        })
    }

  });
