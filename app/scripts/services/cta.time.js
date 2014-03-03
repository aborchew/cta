'use strict';

angular.module('ctaApp')
  .factory('ctaTime', function ($q, ctaYqlRequest) {
    // Service logic

    var that = this;

    if(!Date.prototype.ctaUpdate) {
      extendProto();
      this.date = new Date();
      this.source = 'local';
    }

    setInterval(function () {
      that.date.ctaUpdate();
    }, 60000*5);

    setInterval(function () {
      that.date.ctaIncrement();
    }, 1000)

    this.date.ctaUpdate();

    function extendProto() {

      Date.prototype.ctaIncrement = function () {
        that.date.setUTCSeconds(that.date.getUTCSeconds()+1);
      }

      Date.prototype.ctaUpdate = function () {

        ctaYqlRequest
          .get('gettime')
          .then(function (data) {
            var data = data.data;
            var dateString = data.tm.slice(0,4) + '-' + data.tm.slice(4,6) + '-' + data.tm.slice(6,8) + ' ' + data.tm.split(' ')[1];
            that.date = new Date(dateString)
            that.source = 'cta'
          }, function () {
            that.date = new Date();
            that.source = 'local'
          });

      }

    }

    function get() {
      return {
        date: that.date,
        ts: new Date(),
        source: that.source
      }
    }

    // Public API here

    return {
      get: get
    };
  });
