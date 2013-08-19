/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-star' : '&#x2a;',
			'icon-home' : '&#x48;',
			'icon-connection' : '&#x57;',
			'icon-stack' : '&#x23;',
			'icon-coin' : '&#x24;',
			'icon-location' : '&#x50;',
			'icon-map' : '&#x4d;',
			'icon-map-2' : '&#x6d;',
			'icon-clock' : '&#x63;',
			'icon-clock-2' : '&#x43;',
			'icon-alarm' : '&#x41;',
			'icon-undo' : '&#x42;',
			'icon-spinner' : '&#x52;',
			'icon-happy' : '&#x29;',
			'icon-sad' : '&#x28;',
			'icon-warning' : '&#x21;',
			'icon-info' : '&#x69;',
			'icon-close' : '&#x58;',
			'icon-arrow-right' : '&#x3e;',
			'icon-radio-unchecked' : '&#x38;',
			'icon-checkbox-unchecked' : '&#x3a;',
			'icon-checkbox-checked' : '&#x39;',
			'icon-wrench' : '&#x53;',
			'icon-location-2' : '&#x4c;',
			'icon-target' : '&#x4f;',
			'icon-grid' : '&#x27;',
			'icon-list' : '&#x47;',
			'icon-arrow-right-2' : '&#x4e;',
			'icon-arrow-left' : '&#x3c;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};