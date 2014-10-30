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
		d3textwrap: './lib/d3textwrap/d3textwrap.v0',
		topojson: '../bower_components/topojson/topojson',
		eventEmitter: '../bower_components/eventEmitter/EventEmitter'
	},

	shim: {
		q: {
			exports: 'Q'
		},

		zepto: {
			exports: '$'
		},

		d3textwrap: {
			deps: ['d3']
		}
	}
});

require(['app/main']);