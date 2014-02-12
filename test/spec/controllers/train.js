'use strict';

describe('Controller: TrainCtrl', function () {

  // load the controller's module
  beforeEach(module('ctaApp'));

  var TrainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrainCtrl = $controller('TrainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
