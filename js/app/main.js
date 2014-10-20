'use strict';

define(['require', 'd3'], function(require, d3) {
	require(['./map/map'], function(Map) {
		var width = 600;
		var height = 400;

		var svg = d3.select('body')
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		d3.select(window)
			.on('resize', function() {
				svg.attr('width', window.innerWidth);
			});

		var map = new Map(svg, width, height);

		map.load();
	});
});