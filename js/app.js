'use strict';

requirejs.config({
	baseUrl: 'js',

	paths: {
		q: '../bower_components/q/q',
		nprogress: '../bower_components/nprogress/nprogress',
		zepto: '../bower_components/zepto/zepto',
		deepmerge: '../bower_components/deepmerge/index',
		easing: '../bower_components/easing/easing',
		moment: '../bower_components/moment/moment',
		underscore: '../bower_components/underscore/underscore',
		d3: '../bower_components/d3/d3',
		d3textwrap: './lib/d3textwrap/d3textwrap.v0',
		d3tip: './lib/d3-tip/index',
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
		},

		d3tip: {
			deps: ['d3']
		}
	}
});

require(['app/main']);