cta
	.factory('api', function($http,$rootScope,$timeout,$q) {
	
	  return {
	  	proxy: 'ba-simple-proxy.php',
			host: 'http://www.ctabustracker.com',
			port: '80',
			path: '/bustime/api/v1/',
			key: 'rHY3JsWPQvFBerftmPfPGGdzZ',
			getFullPath: function() {
				return this.proxy + '?url=' + this.host + ':' + this.port + this.path;
			},
			xmlToJson: function(txt) {
							
				// Changes XML to JSON
				function xmlToJson(xml) {
					
					// Create the return object
					var obj = {};
				
					if (xml.nodeType == 1) { // element
						// do attributes
						if (xml.attributes.length > 0) {
						obj["@attributes"] = {};
							for (var j = 0; j < xml.attributes.length; j++) {
								var attribute = xml.attributes.item(j);
								obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
							}
						}
					} else if (xml.nodeType == 3) { // text
						obj = xml.nodeValue;
					}
				
					// do children
					if (xml.hasChildNodes()) {
						for(var i = 0; i < xml.childNodes.length; i++) {
							var item = xml.childNodes.item(i);
							var nodeName = item.nodeName;
							if (typeof(obj[nodeName]) == "undefined") {
								obj[nodeName] = xmlToJson(item);
							} else {
								if (typeof(obj[nodeName].push) == "undefined") {
									var old = obj[nodeName];
									obj[nodeName] = [];
									obj[nodeName].push(old);
								}
								obj[nodeName].push(xmlToJson(item));
							}
						}
					}
					return obj;
				};
				
				var parser=new DOMParser();
        var xml=parser.parseFromString(txt,'text/xml');
        
        return xmlToJson(xml);
				
			},
			
			appendKey: function(data) {
				if(typeof data != 'object') {
					data = {
						key: this.key
					}
	    	} else if(data && !data.key) {
		    	data.key = this.key;
	    	}
	    	return data;
			},
	    
	    getBusDirections : function(data) {
	    	if(!data) data = [];
	      return {
	      	url : this.getFullPath() + 'getdirections' + encodeURIComponent('?key=' + this.key + '&' + $.param(data)),
	      	method : 'GET',
	      	cache : false,
	      	timeout : 10000
	      };
	    },
	    
	    getBusRoutes : function(data) {
	    	if(!data) data = [];
	      return {
	      	url : this.getFullPath() + 'getroutes' + encodeURIComponent('?key=' + this.key + '&' + $.param(data)),
	      	method : 'GET',
	      	cache : false,
	      	timeout : 10000
	      };
	    },
	    
	    getBusStops : function(data) {
				if(!data) data = [];
		    return {
	      	url : this.getFullPath() + 'getstops' + encodeURIComponent('?key=' + this.key + '&' + $.param(data)),
	      	method : 'GET',
	      	cache : false,
	      	timeout : 10000
	      };
	    },

			getPredictions : function(data) {
				if(!data) data = [];
		    return {
	      	url : this.getFullPath() + 'getpredictions' + encodeURIComponent('?key=' + this.key + '&' + $.param(data)),
	      	method : 'GET',
	      	cache : false,
	      	timeout : 10000
	      };
	    }

	    
	  };
	  
	})
