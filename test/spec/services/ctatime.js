'use strict';

describe('Service: ctaTime', function () {

  // load the service's module
  beforeEach(module('ctaApp'));

  // instantiate service
  var ctaTime;
  beforeEach(inject(function (_ctaTime_) {
    ctaTime = _ctaTime_;
  }));

  it('should do something', function () {
    expect(!!ctaTime).toBe(true);
  });

});
