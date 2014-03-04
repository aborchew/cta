'use strict';

angular.module('ctaApp')
  .service('ctaBusRoutes', function ($q, $filter, ctaYqlRequest) {

    // Service logic

    var route
      , routes = []
      , directions = []
      , serviceInfo
      , dirCount
      , stopsResolveCount
      , serviceResolveCount
      ;

    var Route = function (spec) {

      if(!spec) {
        throw new Error('Cannot create a Route without spec.');
      }

      function refresh () {

        var def = $q.defer();

        function checkSum() {
          if(stopsResolveCount === dirCount && serviceResolveCount === dirCount) {
            def.resolve();
          }
        }

        ctaYqlRequest
          .get('getdirections',{rt:spec.rt})
          .then(function(data){
            findRoute(spec);
            setDirections(data.data.dir)
            dirCount = directions.length;
            stopsResolveCount = 0;
            serviceResolveCount = 0;
            for(var i = 0; i < dirCount; i++) {
              directions[i]
                .refreshStops()
                .then(function(){
                  stopsResolveCount += 1;
                  checkSum();
                })
              directions[i]
                .refreshServiceInfo()
                .then(function(){
                  serviceResolveCount += 1;
                  checkSum();
                })
            }
          });

        return def.promise;

      }

      function get () {

        return directions;

      }

      function setDirections (spec) {

        if(!spec) {
          throw new Error('Cannot set directions without an Array of directions.');
        }

        directions = [];

        if(spec instanceof Array) {

          for(var i = 0, len = spec.length; i < len; i++) {

            directions[directions.length] = new Direction(spec[i]);

          }

        } else if(typeof spec === 'string') {

          directions = [new Direction(spec)];

        }

      }

      return {
        routeId: spec.rt,
        routeName: spec.rtnm,
        refresh: refresh,
        get: get
      }

    }

    var Direction = function (spec) {

      if(!spec) {
        throw new Error('Must specify a Route Direction when creating a new Direction.');
      }

      var stops
        , dir = spec;

      function refreshStops () {

        var def = $q.defer();

        ctaYqlRequest
          .get('getstops',{rt:route.routeId,dir:dir})
          .then(function(data){
            stops = [];
            if(data.data.stop && !data.data.error) {
              for(var i = 0, len = data.data.stop.length; i < len; i++) {
                stops[stops.length] = new Stop(data.data.stop[i],dir);
              }
            }
            def.resolve();
          });

        return def.promise;

      }

      function refreshServiceInfo () {

        var def = $q.defer();

        ctaYqlRequest
          .get('getservicebulletins',{rt:route.routeId,rtdir:dir})
          .then(function(data){
            serviceInfo = [];
            if(data.data.sb) {
              serviceInfo = new ServiceBulletin(data.data.sb,dir)
            }
            def.resolve();
          });

        return def.promise;

      }

      function getStops () {

        if(!stops.length) {
          refreshStops();
        }

        return stops;

      }

      function getServiceInfo () {

        return serviceInfo;

      }

      return {
        direction: dir,
        routeId: route.routeId,
        refreshStops: refreshStops,
        refreshServiceInfo: refreshServiceInfo,
        getStops: getStops,
        getServiceInfo: getServiceInfo
      }

    }

    var Stop = function (spec) {

      if(!spec) {
        throw new Error('Error creating Stop - spec missing.');
      }

      var spec = spec;
      var arrivals = [];
      var serviceInfo = [];

      function refreshServiceInfo () {

        var def = $q.defer();

        ctaYqlRequest
          .get('getservicebulletins',{stpid:spec.stpid})
          .then(function(data){
            serviceInfo = [];
            if(data.data.sb) {
              serviceInfo = new ServiceBulletin(data.data.sb)
            }
            def.resolve();
          });

        return def.promise;

      }

      function refresh () {

        var def = $q.defer()

        ctaYqlRequest
          .get('getpredictions',{stpid:spec.stpid})
          .then(function (data) {
            arrivals = [];
            var predictions = data.data.prd
            for (var i = 0, len = predictions.length; i < len; i++) {
              arrivals[arrivals.length] = new Prediction(predictions[i]);
            }
            refreshServiceInfo()
              .then(function () {
                def.resolve();
              })
          });

          return def.promise;

      }

      function get () {
        return arrivals;
      }

      function getServiceInfo () {
        return serviceInfo;
      }

      return {
        stopId: spec.stpid,
        stopName: spec.stpnm,
        lattitude: spec.lat,
        longitude: spec.lon,
        get: get,
        refresh: refresh,
        getServiceInfo: getServiceInfo
      }

    }

    var ServiceBulletin = function (spec,dir) {

      if(!spec) {
        throw new Error('Cannot create a Service Bulletin without a spec');
      }

      var serviceBulletinItems = [];

      for(var i = 0, len = spec.length; i < len; i++) {
        serviceBulletinItems[serviceBulletinItems.length] = new ServiceBulletinItem(spec[i]);
      }

      return {
        route: route,
        items: serviceBulletinItems
      }

    }

    var ServiceBulletinItem = function (spec) {

      if(!spec) {
        throw new Error('Cannot create a Service Bulletin Item without a spec');
      }

      return {
        detail: spec.dtl,
        title: spec.nm,
        priority: spec.prty,
        subject: spec.sbj,
        brief: spec.brf
      }

    }

    var Prediction = function (spec) {

      if(!spec) {
        throw new Error('Cannot generate a prediction with spec.');
      }

      function getTimeDifference () {
        var diff;
        function parseCtaTime(dateSpec) {
          var dateString = dateSpec.slice(0,4) + '-' + dateSpec.slice(4,6) + '-' + dateSpec.slice(6,8) + ' ' + dateSpec.split(' ')[1];
          var arr = dateString.split(/[- :]/);
          return new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
        }
        diff = parseCtaTime(spec.prdtm).getTime() - parseCtaTime(spec.tmstmp).getTime();
        return Math.floor(diff/60000) - 1;
      }

      function getDist() {

        var miles = Math.floor(parseInt(spec.dstp) / 5280);
        var units = 'feet';
        var value = $filter('number')(spec.dstp);

        if(miles >= 1) {
          units = 'mile';
          value = miles;
          if(miles > 1) {
            units = 'miles';
          }
        }

        return {
          value: value,
          unit: units
        }
      }

      return {
        destName: spec.des,
        distance: getDist(),
        type: spec.typ,
        arrivalTime: spec.prdtm,
        stopName: spec.stpnm,
        vehicleId: spec.vid,
        timestamp: spec.tmstmp,
        arrivesIn: getTimeDifference(),
        routeId: spec.rt,
        routeDirection: spec.rtdir
      }

    }

    function findRoute (spec) {

      if(!spec) {
        throw new Error('Must Specift a routeId');
      }

      route = $filter('filter')(routes,{routeId:spec.rt},true)

      if(!route.length) {
        throw new Error('Specified Route could not be found.')
      }

      route = route[0];

    }

    function setRoutes (spec) {

      if(!spec) {
        throw new Error('Cannot set Routes without spec');
      }

      routes = [];
      for(var i = 0, len = spec.length; i < len; i++) {
        routes[routes.length] = new Route(spec[i]);
      }

    }

    function refresh () {

      var def = $q.defer();

      ctaYqlRequest
        .get('getroutes')
        .then(function(data) {
          setRoutes(data.data.route);
          def.resolve();
        });

      return def.promise;

    }

    function get (spec) {

      if(!routes.length) {
        refresh();
      }

      if(!spec) {
        return routes;
      }

      var route = $filter('filter')(routes,{routeId:spec},true);

      if(route.length === 1) {
        return route[0];
      }

    }

    // Public API here
    return {
      refresh: refresh,
      get: get
    };

  });
