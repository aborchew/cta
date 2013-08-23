cta
	.config(['$routeProvider', function($routeProvider) {
	
		$routeProvider/*
.when(
	  	'/home', {
	  		templateUrl: 'tmpl/tmpl-app.html',
	  		controller: 'cta'
	  	}
	  )
*/.when(
	  	'/bus/routes', {
	  		templateUrl: 'tmpl/tmpl-busRoutes.html',
	  		controller: 'busRoutes',
	  		resolve: {
	  			busRoutes: cta.resolve.busRoutes
	  		}
	  	}
	  ).when(
	  	'/bus/routes/:routeId', {
	  		templateUrl: 'tmpl/tmpl-busStops.html',
	  		controller: 'busStops',
	  		resolve: {
	  			busStops: cta.resolve.busStops
	  		}
	  	}
	  ).when(
	  	'/bus/routes/:routeId/:stopId', {
	  		templateUrl: 'tmpl/tmpl-busStop.html',
	  		controller: 'busStop',
	  		resolve: {
	  			busStops: cta.resolve.busStop
	  		}
	  	}
	  ).otherwise({ 
	  	redirectTo: '/bus/routes'
	  });
	
	}])

	.resolve = {
		
		busRoutes: function($rootScope,$q,$http,api) {
			
			var parseBusRoutes = function(routes) {
				var parsedRoutes = [];
				angular.forEach(routes,function(route) {
					parsedRoutes.push({
						routeId: route['rt']['#text'],
						routeName: route['rtnm']['#text']
					})
				});
				if(parsedRoutes.length > 0) {
					$rootScope.setBusRoutes(parsedRoutes)
					deferred.resolve(parsedRoutes);
				}
			}
		
			var deferred = $q.defer();
			$http(api.getBusRoutes())
			.success(function(data){
				data.contents = api.xmlToJson(data.contents);
				if(data.contents && data.contents['bustime-response'] && !data.contents['bustime-response']['error'] && data.contents['bustime-response']['route']) {
					parseBusRoutes(data.contents['bustime-response'].route);
				} else {
					deferred.reject('Failed to retrieve bus routes from API');
				}
			})
			.error(function(){
				deferred.reject('Failed to retrieve bus routes from API');
			});
			return deferred.promise;
			
		},
		
		busStops : function($timeout,$rootScope,$route,$q,$http,api) {
		
			var getDirections = function() {
			
				var parseBusDirections = function(directions) {
					var tempDirections = [];
					angular.forEach(directions,function(direction){
						tempDirections.push(direction['#text']);
					});
					$rootScope.setDirections(tempDirections);
				}
			
				var directionsPromise = $q.defer();
				$http(api.getBusDirections({'rt':$route.current.params.routeId}))
				.success(function(data){
					data.contents = api.xmlToJson(data.contents);
					if(data.contents && data.contents['bustime-response'] && !data.contents['bustime-response']['error'] && data.contents['bustime-response']['dir']) {
						parseBusDirections(data.contents['bustime-response'].dir);
						directionsPromise.resolve(data.contents['bustime-response'].dir);
					} else {
						directionsPromise.reject('Failed to retrieve bus directions from API');
					}
				})
				.error(function(){
					directionsPromise.reject('Failed to retrieve bus directions from API');
				});
				return directionsPromise.promise;
				
			}
		
			var getStops = function() {
				
				var parseCount = 0;
				var parsedStops = [];
				
				var parseBusStops = function(stops,dir) {
					angular.forEach(stops,function(stop) {
						parsedStops.push({
							lat: stop['lat']['#text'],
							lon: stop['lon']['#text'],
							stopId: stop['stpid']['#text'],
							stopName: stop['stpnm']['#text'],
							routeDirection: dir
						})
					});
					parseCount ++;
					if(parsedStops.length > 0) {
						if(parseCount == 2) {
							$rootScope.setBusStops(parsedStops);
							stopsPromise.resolve();
						}
					}
				}
			
				var stopsPromise = $q.defer();
				$http(api.getBusStops({'rt':$route.current.params.routeId,'dir':$rootScope.busDirections.possible[0]}))
				.success(function(data){
					data.contents = api.xmlToJson(data.contents);
					if(data.contents && data.contents['bustime-response'] && !data.contents['bustime-response']['error'] && data.contents['bustime-response']['stop']) {
						parseBusStops(data.contents['bustime-response'].stop,$rootScope.busDirections.possible[0]);
					} else {
//						stopsPromise.reject('Failed to retrieve bus stops from API');
					}
				})
				.error(function(){
//					stopsPromise.reject('Failed to retrieve bus stops from API');
				});

				$http(api.getBusStops({'rt':$route.current.params.routeId,'dir':$rootScope.busDirections.possible[1]}))
				.success(function(data){
					data.contents = api.xmlToJson(data.contents);
					if(data.contents && data.contents['bustime-response'] && !data.contents['bustime-response']['error'] && data.contents['bustime-response']['stop']) {
						parseBusStops(data.contents['bustime-response'].stop,$rootScope.busDirections.possible[1]);
					} else {
//						stopsPromise.reject('Failed to retrieve bus stops from API');
					}
				})
				.error(function(){
//					stopsPromise.reject('Failed to retrieve bus stops from API');
				});

				return stopsPromise.promise;
				
			};
		
			var deferred = getDirections();
			deferred.then(function(){
				return getStops();
			},function(){
				return false;
			})
			
		},
		
		busStop : function($timeout,$rootScope,$route,$q,$http,api) {
			
			var parseBusPredictions = function(predictions) {
				var tempPredictions = [];
				angular.forEach(predictions,function(prediction){
					var newObj = {};
					if(prediction['dly']) {
						newObj['delay'] = true;
					};
					newObj['destination'] = prediction['des']['#text'];
					newObj['distanceFeet'] = prediction['dstp']['#text'];
					newObj['predictedTime'] = prediction['prdtm']['#text'];
					newObj['routeId'] = prediction['rt']['#text'];
					newObj['routeDir'] = prediction['rtdir']['#text'];
					newObj['stopId'] = prediction['stpid']['#text'];
					newObj['stopName'] = prediction['stpnm']['#text'];
					newObj['timestamp'] = prediction['tmstmp']['#text'];
					newObj['type'] = prediction['typ']['#text']; // "A"rrival or "D"eparture
					newObj['vehicleId'] = prediction['vid']['#text'];
					tempPredictions.push(newObj);
				});
				$rootScope.setPredictions(tempPredictions);
				predictionsPromise.resolve(tempPredictions);
			}
		
			var predictionsPromise = $q.defer();
			$http(api.getPredictions({'stpid':$route.current.params.stopId}))
			.success(function(data){
				data.contents = api.xmlToJson(data.contents);
				if(data.contents && data.contents['bustime-response'] && !data.contents['bustime-response']['error'] && data.contents['bustime-response']['prd']) {
					parseBusPredictions(data.contents['bustime-response'].prd);
				} else {
					predictionsPromise.reject('Failed to retrieve bus directions from API');
				}
			})
			.error(function(){
				directionsPromise.reject('Failed to retrieve bus directions from API');
			});
			return predictionsPromise.promise;
			
		}
		
	}