'use strict';

requirejs.config({
	baseUrl: 'js',

	paths: {
		d3: '../bower_components/d3/d3',
		topojson: '../bower_components/topojson/topojson'
	}
});

require(['app/main']);