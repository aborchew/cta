'use strict';

cta.directive('ngTap',function() {
  return {
  	scope: false,
	  compile: function(sc,el,trans) {
	  	return {
		  	pre: function preLink(sc,el,at,co){
			  	if(sc.isMobile) {
				    sc.isTapping = false;
				    el.bind('touchstart', function(e) {
				      el.addClass('tapping');
				      sc.isTapping = true;
				    });
				    el.bind('touchmove', function(e) {
				      el.removeClass('tapping');
				      sc.isTapping = false;
				    });
				    el.bind('touchend', function(e) {
				    	e.preventDefault();
				    	e.stopPropagation();
				      el.removeClass('tapping');
				      if(sc.isTapping) {
				      	sc.ngTapEvent = e;
				      	if(!angular.element(el[0]).hasClass('disabled')) {
							  	sc.$apply(at['ngTap'], el);
						  	}
				      }
				    });
				  } else {
					  el.bind('click',function(e){
					  	e.preventDefault();
				    	e.stopPropagation();
					  	sc.ngTapEvent = e;
					  	if(!angular.element(el[0]).hasClass('disabled')) {
						  	sc.$apply(at['ngTap'], el);
					  	}
				    })
				  };
		  	},
		  	post: function postLink(sc,el,at,co){}
	  	}
	  }
	};
});

cta.directive('ctaSearch',function() {
  return {
  	scope: {
	  	ngModel: "@",
	  	labelBefore: "@",
	  	labelAfter: "@",
	  	placeholder: "@"
  	},
  	restrict: 'E',
  	templateUrl: 'tmpl/tmpl-search.html',
	  compile: function(sc,el,trans) {
	  	return {
		  	pre: function preLink(sc,el,at,co){

		  	},
		  	post: function postLink(sc,el,at,co){
			  	
		  	}
	  	}
	  }
	};
});

cta.directive('makeTwoLinesIfNeeded',function($timeout) {
  return {
  	scope: false,
  	restrict: 'A',
	  compile: function(sc,el,trans) {
	  	return {
		  	pre: function preLink(sc,el,at,co){
					
		  	},
		  	post: function postLink(sc,el,at,co){
			  	$timeout(function(){
			  		var target = $(el[0])[at.makeTwoLinesIfNeeded.split('|')[0]](at.makeTwoLinesIfNeeded.split('|')[1]);
			  		if($(el[0]).height() > target.height()) {
				  		$(el[0]).addClass(at.makeTwoLinesIfNeeded.split('|')[2]);
			  		}
			  	},0);
		  	}
	  	}
	  }
	};
});