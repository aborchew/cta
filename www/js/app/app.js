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
	
	.run(function($rootScope,$timeout,$http,$location,api){
	
		$rootScope.navigate = function(newRoute) {
			$location.path(newRoute);
		}
				
		$rootScope.setBusRoutes = function(routes) {
			$rootScope.busRoutes = routes;
		}
		
		$rootScope.getBusRoutes = function() {
			return $rootScope.busRoutes;
		}
		
		$rootScope.setDirections = function(directions) {
			$rootScope.possibleDirections = directions;
			$rootScope.setSelectedDirection($rootScope.getDirections()[0]);
		}
		
		$rootScope.getDirections = function() {
			return $rootScope.possibleDirections;
		}
		
		$rootScope.setSelectedDirection = function(direction) {
			$rootScope.selectedDirection = direction;
		}
		
		$rootScope.getSelectedDirection = function() {
			return $rootScope.selectedDirection;
		}
		
		$rootScope.setBusStops = function(stops) {
			$rootScope.busStops = stops;
		}
		
		$rootScope.getBusStops = function() {
			return $rootScope.busStops;
		}
		
		$rootScope.setPredictions = function(predictions) {
			$rootScope.predictions = predictions
		}
		
		$rootScope.getPredictions = function() {
			return $rootScope.predictions;
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
		
	});