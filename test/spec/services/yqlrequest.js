'use strict';

describe('Service: yqlRequest', function () {

  // load the service's module
  beforeEach(module('ctaApp'));

  // instantiate service
  var yqlRequest;
  beforeEach(inject(function (_yqlRequest_) {
    yqlRequest = _yqlRequest_;
  }));

  it('should do something', function () {
    expect(!!yqlRequest).toBe(true);
  });

});
