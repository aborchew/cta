'use strict';

angular.module('ctaApp')
  .controller('MainCtrl', function ($scope, $firebase, $http, $q, $filter, routes) {

    $scope.routes = routes.data;
    $scope.stops = [];
    $scope.stopsInView = [];
    $scope.location = {};

    function drawMap () {

      $scope.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: $scope.location,
        disableDefaultUI: true
      });

      var styles = [
        {
          stylers: [
            { hue: "#00ffe6" },
            { saturation: -20 }
          ]
        },{
          featureType: "poi",
          elementType: "all",
          stylers: [
            { visibility: "off" }
          ]
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry",
          stylers: [
            { visibility: "off" }
          ]
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];

      var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

      $scope.map.mapTypes.set('map_style', styledMap);
      $scope.map.setMapTypeId('map_style');

      var marker = new google.maps.Marker({
        position: $scope.location,
        icon: {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: 'yellow',
          fillOpacity: 0.8,
          scale: .1,
          strokeColor: 'gold',
          strokeWeight: 2
        },
        title: 'Current Position',
        map: $scope.map
      });

      google.maps.event.addListener($scope.map, "bounds_changed", function () {
        var maxStops = 100;
        angular.forEach($scope.stopsInView, function (marker) {
          marker.setMap(null);
        });
        var bounds = $scope.map.getBounds();
        $scope.stopsInView = [];
        angular.forEach($scope.stops, function (stop) {
          if($scope.stopsInView > maxStops) {
            return false;
          }
          if(stop.lat < bounds.Aa.j && stop.lat > bounds.Aa.k && stop.lon > bounds.qa.j && stop.lon < bounds.qa.k) {
            $scope.stopsInView[$scope.stopsInView.length] = new google.maps.Marker({
              position: new google.maps.LatLng(stop.lat, stop.lon),
              title: stop.name
            });
          }
        });
        if($scope.stopsInView.length <= maxStops) {
          angular.forEach($scope.stopsInView, function (marker) {
            marker.setMap($scope.map);
            google.maps.event.addListener
          });
        }
      })

    }

    function getLocation () {

      var deferred = $q.defer();

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          $scope.location = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
          deferred.resolve();
        })
      } else {
        $scope.location = new google.maps.LatLng('41.8819', '-87.6278');
        deferred.reject();
      }

      return deferred.promise;

    }

    $scope.loadMap = function () {

      if(!$scope.stops.length) {

        var sTime = new Date().getTime();

        $http
          // .get('https://ctabustracker.firebaseio.com/stops.json')
          .get('scripts/stubs/stops.json')
          .success(function (stops) {
            var nullStops = []
            angular.forEach(stops,function (stop, ind) {
              if(stop) {
                $scope.stops[$scope.stops.length] = stop;
              }
            })
            console.log($scope.stops.length + ' stops retrieved in ' + ((new Date().getTime() - sTime) / 1000) + ' seconds');
            getLocation()
              .then(drawMap)
          })

      } else {
        console.log($scope.stops.length + ' cached stops');
      }

    }

  });
