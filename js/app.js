'use strict';

requirejs.config({
	baseUrl: 'js',

	paths: {
		zepto: '../bower_components/zepto/zepto',
		moment: '../bower_components/moment/moment',
		d3: '../bower_components/d3/d3',
		topojson: '../bower_components/topojson/topojson'
	},

	shim: {
		zepto: {
			exports: '$'
		}
	}
});

require(['app/main']);