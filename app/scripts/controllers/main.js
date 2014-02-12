'use strict';

angular.module('ctaApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    if(isMobile) {
      $('#status').html('READY! - MOBILE');
    } else {
      $('#status').html('READY! - DESKTOP');
    }
  }]);
