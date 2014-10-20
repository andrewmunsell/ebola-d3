'use strict';

define(['require', 'zepto', 'd3'], function(require, $, d3) {
	require(['./map/map'], function(Map) {
		var parent = $('#map-container');

		var width = parent.width();
		var height = 600;

		var svg = d3.select('#map-container')
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		d3.select(window)
			.on('resize', function() {
				var width = parent.width();
				var height = 600;

				svg.attr('width', width);
				svg.attr('height', height);
			});

		var map = new Map(svg, width, height);

		map.load();
	});
});