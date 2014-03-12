"use strict";angular.module("ctaApp",["ngRoute","ui.bootstrap","ngSanitize","snap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/bus/routes",{templateUrl:"views/cta.bus.routes.html",controller:"busRoutesCtrl"}).when("/favorites",{templateUrl:"views/favorites.html",controller:"FavoritesCtrl"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl"}).when("/bus/routes/:route/stops",{templateUrl:"views/cta.bus.routes.route.html",controller:"BusRoutesRouteCtrl"}).when("/bus/routes/:route/stops/:stop/:direction",{templateUrl:"views/cta.bus.stops.stop.html",controller:"BusStopsStopCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope",function(a){a.showBulletins=!0,a.back=function(){window.history.back()}}]),angular.module("ctaApp").controller("MainCtrl",["$scope","ctaTime",function(){}]),angular.module("ctaApp").controller("busRoutesCtrl",["$scope","ctaBusRoutes",function(a,b){a.routes=[],b.refresh().then(function(){a.routes=b.get()})}]),angular.module("ctaApp").controller("FavoritesCtrl",["$scope","ctaTime",function(){}]),angular.module("ctaApp").controller("SettingsCtrl",["$scope","ctaTime",function(){}]),angular.module("ctaApp").factory("ctaYqlRequest",["$http","$q",function(a){function b(a,b){return b.key=f,b="?"+encodeURIComponent($.param(b))+"'&format=json",e+d+a+b}function c(c,d){if(!c)throw new Error("Service name was not specified");return d&&"object"==typeof d||(d={}),a({url:b(c,d),method:"GET",timeout:5e3,cache:!1,transformResponse:function(a){return angular.fromJson(a).query.results["bustime-response"]}})}var d,e,f;return d="http://www.ctabustracker.com/bustime/api/v1/",e="http://query.yahooapis.com/v1/public/yql?q=select * from xml where url='",f="rHY3JsWPQvFBerftmPfPGGdzZ",{get:c}}]),angular.module("ctaApp").factory("ctaTime",["$q","ctaYqlRequest",function(a,b){function c(){Date.prototype.ctaIncrement=function(){e.date.setUTCSeconds(e.date.getUTCSeconds()+1)},Date.prototype.ctaUpdate=function(){b.get("gettime").then(function(a){var a=a.data,b=a.tm.slice(0,4)+"-"+a.tm.slice(4,6)+"-"+a.tm.slice(6,8)+" "+a.tm.split(" ")[1];e.date=new Date(b),e.source="cta"},function(){e.date=new Date,e.source="local"})}}function d(){return{date:e.date,ts:new Date,source:e.source}}var e=this;return Date.prototype.ctaUpdate||(c(),this.date=new Date,this.source="local"),setInterval(function(){e.date.ctaUpdate()},3e5),setInterval(function(){e.date.ctaIncrement()},1e3),this.date.ctaUpdate(),{get:d}}]),angular.module("ctaApp").service("ctaBusRoutes",["$q","$filter","ctaYqlRequest",function(a,b,c){function d(a){if(!a)throw new Error("Must Specift a routeId");if(h=b("filter")(m,{routeId:a.rt},!0),!h.length)throw new Error("Specified Route could not be found.");h=h[0]}function e(a){if(!a)throw new Error("Cannot set Routes without spec");m=[];for(var b=0,c=a.length;c>b;b++)m[m.length]=new o(a[b])}function f(){var b=a.defer();return c.get("getroutes").then(function(a){e(a.data.route),b.resolve()}),b.promise}function g(a){if(m.length||f(),!a)return m;var c=b("filter")(m,{routeId:a},!0);return 1===c.length?c[0]:void 0}var h,i,j,k,l,m=[],n=[],o=function(e){function f(){function f(){k===j&&l===j&&g.resolve()}var g=a.defer();return c.get("getdirections",{rt:e.rt}).then(function(a){d(e),h(a.data.dir),j=n.length,k=0,l=0,c.get("getpatterns",{rt:e.rt}).then(function(a){for(var c=0;j>c;c++){var d=b("filter")(a.data.ptr,{rtdir:n[c].direction})[0];n[c].refreshStops().then(function(){k+=1,f()}),n[c].refreshServiceInfo().then(function(){l+=1,f()}),n[c].pattern.set(d)}})}),g.promise}function g(){return n}function h(a){if(!a)throw new Error("Cannot set directions without an Array of directions.");if(n=[],a instanceof Array)for(var b=0,c=a.length;c>b;b++)n[n.length]=new p(a[b]);else"string"==typeof a&&(n=[new p(a)])}if(!e)throw new Error("Cannot create a Route without spec.");return{routeId:e.rt,routeName:e.rtnm,refresh:f,get:g}},p=function(b){function d(){var b=a.defer();return c.get("getstops",{rt:h.routeId,dir:m}).then(function(a){if(l=[],a.data.stop&&!a.data.error)for(var c=0,d=a.data.stop.length;d>c;c++)l[l.length]=new q(a.data.stop[c],m);b.resolve()}),b.promise}function e(){var b=a.defer();return c.get("getservicebulletins",{rt:h.routeId,rtdir:m}).then(function(a){i=[],a.data.sb&&(i=new r(a.data.sb,m)),b.resolve()}),b.promise}function f(){return l.length||d(),l}function g(){return i}function j(a){n=new t(a)}function k(){return n}if(!b)throw new Error("Must specify a Route Direction when creating a new Direction.");var l,m=b,n={};return{direction:m,routeId:h.routeId,pattern:{get:k,set:j},setPattern:j,refreshStops:d,refreshServiceInfo:e,getStops:f,getServiceInfo:g}},q=function(b){function d(){var d=a.defer();return c.get("getservicebulletins",{stpid:b.stpid}).then(function(a){i=[],a.data.sb&&(i=new r(a.data.sb)),d.resolve()}),d.promise}function e(){var e=a.defer();return c.get("getpredictions",{stpid:b.stpid}).then(function(a){h=[];for(var b=a.data.prd,c=0,f=b.length;f>c;c++)h[h.length]=new v(b[c]);d().then(function(){e.resolve()})}),e.promise}function f(){return h}function g(){return i}if(!b)throw new Error("Error creating Stop - spec missing.");var b=b,h=[],i=[];return{stopId:b.stpid,stopName:b.stpnm,lattitude:b.lat,longitude:b.lon,get:f,refresh:e,getServiceInfo:g}},r=function(a){if(!a)throw new Error("Cannot create a Service Bulletin without a spec");for(var b=[],c=0,d=a.length;d>c;c++)b[b.length]=new s(a[c]);return{route:h,items:b}},s=function(a){if(!a)throw new Error("Cannot create a Service Bulletin Item without a spec");return{detail:a.dtl,title:a.nm,priority:a.prty,subject:a.sbj,brief:a.brf}},t=function(a){if(!a)throw new Error("Cannot create Pattern without spec");for(var b=[],c=0,d=a.pt.length;d>c;c++)b[b.length]=new u(a.pt[c]);return{length:a.ln,pid:a.pid,direction:a.rtdir,waypoints:b}},u=function(a){if(!a)throw new Error("Cannot create Waypoint without spec");return{lattitude:a.lat,longitude:a.lon,distance:a.pdist,sequence:a.seq,stopId:a.stpid,stopName:a.stpnm,type:a.typ}},v=function(a){function c(){function b(a){var b=a.slice(0,4)+"-"+a.slice(4,6)+"-"+a.slice(6,8)+" "+a.split(" ")[1],c=b.split(/[- :]/);return new Date(c[0],c[1]-1,c[2],c[3],c[4])}var c;return c=b(a.prdtm).getTime()-b(a.tmstmp).getTime(),Math.floor(c/6e4)-1}function d(){var c=Math.floor(parseInt(a.dstp)/5280),d="feet",e=b("number")(a.dstp);return c>=1&&(d="mile",e=c,c>1&&(d="miles")),{value:e,unit:d}}if(!a)throw new Error("Cannot generate a prediction with spec.");return{destName:a.des,distance:d(),type:a.typ,arrivalTime:a.prdtm,stopName:a.stpnm,vehicleId:a.vid,timestamp:a.tmstmp,arrivesIn:c(),routeId:a.rt,routeDirection:a.rtdir}};return{refresh:f,get:g}}]),angular.module("ctaApp").controller("BusRoutesRouteCtrl",["$scope","$route","ctaBusRoutes",function(a,b,c){function d(){a.route.refresh().then(function(){a.directions=a.route.get(),a.stops=a.directions[a.activeDirection].getStops(),a.pattern=a.directions[a.activeDirection].pattern.get(),a.serviceBulletins=a.directions[a.activeDirection].getServiceInfo().items,e()})}function e(){f=[];var b,c,d=Math.floor(a.pattern.waypoints.length/2);b=new google.maps.LatLng(a.pattern.waypoints[d].lattitude,a.pattern.waypoints[d].longitude),c=new google.maps.LatLngBounds;for(var e=0,j=a.pattern.waypoints.length;j>e;e++){var k=a.pattern.waypoints[e],l=new google.maps.LatLng(k.lattitude,k.longitude);f[f.length]=l,c.extend(l)}g=new google.maps.Polyline({path:f,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:2}),i={zoom:12,center:b},h=new google.maps.Map(document.getElementById("map-canvas"),i),g.setMap(h),h.fitBounds(c)}var f,g,h,i,j=b.current.params.route;a.route=c.get(j),a.directions=[],a.activeDirection=0,a.stops=[],a.pattern=[],a.toggleDirection=function(){a.activeDirection+1<a.directions.length?a.activeDirection+=1:a.activeDirection=0,a.stops=a.directions[a.activeDirection].getStops(),a.pattern=a.directions[a.activeDirection].pattern.get(),e()},a.route?d():c.refresh().then(function(){a.route=c.get(j),d()})}]),angular.module("ctaApp").controller("BusStopsStopCtrl",["$scope","$route","$filter","ctaBusRoutes",function(a,b,c,d){function e(){var b=c("filter")(d.get(f).get(),{direction:a.direction});if(1!=b.length)throw new Error("Could not find matching stop direction.");b=b[0].getStops();var e=c("filter")(b,{stopId:g});if(1!=e.length)throw new Error("Could not find matching stop ID.");a.stop=e[0],a.stop.refresh().then(function(){a.predictions=a.stop.get()})}var f,g;a.predictions=[],a.direction=b.current.params.direction,f=b.current.params.route,g=b.current.params.stop,d.get().length?e():d.refresh().then(function(){d.get(f).refresh().then(function(){e()})}),a.refreshPredictions=function(){a.predictions=[],a.stop.refresh().then(function(){a.predictions=a.stop.get()})}}]);