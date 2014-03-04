'use strict';

describe('Controller: BusStopsStopCtrl', function () {

  // load the controller's module
  beforeEach(module('ctaApp'));

  var BusStopsStopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BusStopsStopCtrl = $controller('BusStopsStopCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
