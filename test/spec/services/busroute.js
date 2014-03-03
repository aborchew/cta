'use strict';

describe('Service: busRoute', function () {

  // load the service's module
  beforeEach(module('ctaApp'));

  // instantiate service
  var busRoute;
  beforeEach(inject(function (_busRoute_) {
    busRoute = _busRoute_;
  }));

  it('should do something', function () {
    expect(!!busRoute).toBe(true);
  });

});
