'use strict';

cta.controller("cta",function($scope,$http) {
	
	$scope.checkAgent = function(){
		$scope.uaComplete = navigator.userAgent;
		$scope.isMobile = $scope.uaComplete.match(/mobile/i);
		$scope.uaType = {
			ios: $scope.uaComplete.match(/(iPhone|iPod|iPad)/),
			android: $scope.uaComplete.match(/Android/)
		};
		if($scope.isMobile){
			$scope.tapEvent = 'touchstart';
		} else {
			$scope.tapEvent = 'click';
		};
	}
	
	$scope.checkAgent();
	
});

cta.controller("busRoutes",function($rootScope,$scope,$http) {
	
});

cta.controller("busStops",function($rootScope,$scope,$http) {
	
});

cta.controller("busStop",function($rootScope,$scope,$http) {
	
});