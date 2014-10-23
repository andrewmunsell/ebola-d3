'use strict';

requirejs.config({
	baseUrl: 'js',

	paths: {
		q: '../bower_components/q/q',
		zepto: '../bower_components/zepto/zepto',
		deepmerge: '../bower_components/deepmerge/index',
		moment: '../bower_components/moment/moment',
		underscore: '../bower_components/underscore/underscore',
		d3: '../bower_components/d3/d3',
		topojson: '../bower_components/topojson/topojson'
	},

	shim: {
		q: {
			exports: 'Q'
		},

		zepto: {
			exports: '$'
		}
	}
});

require(['app/main']);