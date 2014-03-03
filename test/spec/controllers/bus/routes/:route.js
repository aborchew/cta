'use strict';

describe('Controller: BusRoutesRouteCtrl', function () {

  // load the controller's module
  beforeEach(module('ctaApp'));

  var BusRoutesRouteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BusRoutesRouteCtrl = $controller('BusRoutesRouteCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
