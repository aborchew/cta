'use strict';

describe('Service: ctaBusRoute', function () {

  // load the service's module
  beforeEach(module('ctaApp'));

  // instantiate service
  var ctaBusRoute;
  beforeEach(inject(function (_ctaBusRoute_) {
    ctaBusRoute = _ctaBusRoute_;
  }));

  it('should do something', function () {
    expect(!!ctaBusRoute).toBe(true);
  });

});
