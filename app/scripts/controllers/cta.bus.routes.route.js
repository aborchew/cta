'use strict';

angular.module('ctaApp')
  .controller('BusRoutesRouteCtrl', function ($scope, $route, ctaBusRoutes) {

    var routeId = $route.current.params.route
      , patternCoords
      , patternPath
      , map
      , mapOptions

    $scope.route = ctaBusRoutes.get(routeId);
    $scope.directions = [];
    $scope.activeDirection = 0;
    $scope.stops = [];
    $scope.pattern = [];

    $scope.toggleDirection = function () {
      if($scope.activeDirection+1 < $scope.directions.length) {
        $scope.activeDirection += 1;
      } else {
        $scope.activeDirection = 0;
      }
      $scope.stops = $scope.directions[$scope.activeDirection].getStops();
      $scope.pattern = $scope.directions[$scope.activeDirection].pattern.get();
      createMap();
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
          $scope.pattern = $scope.directions[$scope.activeDirection].pattern.get();
          $scope.serviceBulletins = $scope.directions[$scope.activeDirection].getServiceInfo().items;
          createMap();
        })
    }

    function createMap () {

      patternCoords = [];

      var mdpt = Math.floor($scope.pattern.waypoints.length/2)
        , mapCenter
        , swBound
        , neBound
        , mapBounds
        ;

      mapCenter = new google.maps.LatLng($scope.pattern.waypoints[mdpt].lattitude,$scope.pattern.waypoints[mdpt].longitude);

      mapBounds = new google.maps.LatLngBounds();

      for(var i = 0, len = $scope.pattern.waypoints.length; i < len; i++) {
        var wp = $scope.pattern.waypoints[i];
        var ltlnObj = new google.maps.LatLng(wp.lattitude,wp.longitude);
        patternCoords[patternCoords.length] = ltlnObj
        mapBounds.extend(ltlnObj);
      }

      patternPath = new google.maps.Polyline({
        path: patternCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      mapOptions = {
        zoom: 12,
        center: mapCenter
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      patternPath.setMap(map);

      map.fitBounds(mapBounds);

    }

  });
