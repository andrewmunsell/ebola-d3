'use strict';

define(['require', 'zepto', 'd3'], function(require, $, d3) {
	require(['./map/map', './map/timeline'], function(Map, Timeline) {
		/**
		 * Map
		 */
		
		var parent = $('#map-container');

		var width = parent.width();
		var height = parent.height();

		var svg = d3.select('#map-container')
			.append('svg')
				.attr('width', width)
				.attr('height', height);

		var map = new Map(svg, width, height);
		map.load();	

		/**
		 * Timeline
		 */
		var timelineHeight = 18;

		var svgTimeline = d3.select('#timeline-container')
			.append('svg')
				.attr('width', width)
				.attr('height', timelineHeight);

		var timeline = new Timeline(svgTimeline, width, timelineHeight);

		timeline.emitter.addListener('dateChanged', function(d) {
			map.setDate.call(map, d);
			map.redraw.call(map);
		});

		timeline.load();

		d3.select(window)
			.on('resize', function() {
				var width = parent.width();
				var height = parent.height();

				// Set the map's width and height
				svg.attr('width', width);
				svg.attr('height', height);
				map.setWidth(width);
				map.setHeight(height);

				// Set the timeline's width and height
				svgTimeline.attr('width', width);
				timeline.setWidth(width);
			});
	});
});