'use strict';

angular.module('ctaApp')
  .service('ctaBusRoutes', function ($q, $filter, ctaYqlRequest) {

    // Service logic

    var route
      , routes = []
      , directions = []
      , stops = []
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

      var dir = spec;

      function refreshStops () {

        var def = $q.defer();

        ctaYqlRequest
          .get('getstops',{rt:route.routeId,dir:dir})
          .then(function(data){
            stops = [];
            if(data.data.stop && !data.data.error) {
              for(var i = 0, len = data.data.stop.length; i < len; i++) {
                stops[stops.length] = new Stop(data.data.stop[i]);
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

      function getArrivalTimes () {
        return 'blah';
      }

      return {
        stopId: spec.stpid,
        stopName: spec.stpnm,
        lattitude: spec.lat,
        longitude: spec.lon,
        getArrivalTimes: getArrivalTimes
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

      function refresh () {

        var direction = $filter('filter')(route.get(dir),{direction:dir})

        if(direction.length == 1) {
          direction[0].refreshServiceInfo();
        }

      }

      return {
        route: route,
        refresh: refresh,
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
