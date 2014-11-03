'use strict';

define(['require', 'zepto', 'd3'], function(require, $, d3) {
	require(['./map/map', './map/timeline'], function(Map, Timeline) {
		/**
		 * Configuration
		 */
		var summaryUrl = './data/summary.json';

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

		/**
		 * Summary statistics and last updated date
		 */
		d3.json(summaryUrl)
			.get(function(err, json) {
				if(!err) {
					// Last updated dates
					$('.last-updated').each(function() {
						var format = 'MMMM Do, YYYY';

						if($(this).attr('data-format')) {
							format = $(this).attr('data-format');
						}

						$(this).text(moment(json.dateUpdated).format(format));
					});

					// Statistics
					$('.total-cases').text(json.totalCases);
					$('.total-deaths').text(json.totalDeaths);
				}
			});

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