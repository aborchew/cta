var cta = angular.module('cta', [])

	.config(['$httpProvider', function($httpProvider) {
	
		delete $httpProvider.defaults.headers.common["X-Requested-With"];
		
	}])
	
	.filter('startFrom', function() {
	
		return function(input, start) {
			if(input) return input.slice(start)
			else return 0;
		}
		
	})
	
	.filter('selectedRouteDirection', function($rootScope) {
	
	  return function (stops) {
	
	    var filter_stops = [];
	
	    for (var i = 0; i < stops.length; i++) {
        if (stops[i].routeDirection === $rootScope.busDirections.selected) {
          filter_stops.push(stops[i]);
        }
	    }
	
	    return filter_stops;
	
	  }
	})
	
	.run(function($rootScope,$timeout,$http,$location,$filter,$route,api){
	
		$rootScope.busStops = {};
		$rootScope.busDirections = {};
		$rootScope.prefs = {
			showAllRoutes : 'yes'
		}
	
		$rootScope.navigate = function(newRoute) {
			$location.path(newRoute);
		}
				
		$rootScope.setBusRoutes = function(routes) {
			$rootScope.busRoutes = routes;
		}
		
		$rootScope.getBusRoutes = function() {
			return $rootScope.busRoutes;
		}
		
		$rootScope.getRoute = function() {
			return $route.current.params.routeId;
		}
		
		$rootScope.setDirections = function(directions) {
			$rootScope.busDirections.possible = directions;
			$rootScope.busDirections.selected = $rootScope.busDirections.possible[0];
		}
		
		$rootScope.setBusStops = function(stops) {
			$rootScope.busStops = stops;
		}
		
		$rootScope.getBusStops = function() {
			return $filter('selectedRouteDirection')($rootScope.busStops);
		}
		
		$rootScope.setPredictions = function(predictions) {
			$rootScope.predictions = predictions
		}
		
		$rootScope.getPredictions = function() {
			if($rootScope.prefs.showAllRoutes == 'yes') {
				return $rootScope.predictions; 
			} else {
				return $filter('filter')($rootScope.predictions,function(prediction){
					if (prediction.routeId == $rootScope.getRoute()) { return true }
					else { return false; };
				})
			}
		}
		
		$rootScope.getTimeDisparity = function(now,then) {
		
			var nowDate = new Date(
				now.substring(0,4),
				parseInt(now.substring(4,6))-1,
				now.substring(6,8),
				now.substring(9,17).split(':')[0],
				now.substring(9,17).split(':')[1]
			);
			
			var thenDate = new Date(
				then.substring(0,4),
				parseInt(then.substring(4,6))-1,
				then.substring(6,8),
				then.substring(9,17).split(':')[0],
				then.substring(9,17).split(':')[1]
			);			

			return Math.round((thenDate-nowDate)/60000);
		}
		
		$rootScope.favorite = function() {
			this.val.favorite = !this.val.favorite;
		}
		
	});