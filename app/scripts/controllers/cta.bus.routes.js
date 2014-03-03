'use strict';

angular.module('ctaApp')
  .controller('busRoutesCtrl', function ($scope, ctaBusRoutes) {
    $scope.routes = [];
    ctaBusRoutes
      .refresh()
      .then(function(){
        $scope.routes = ctaBusRoutes.get();
      })
  });
