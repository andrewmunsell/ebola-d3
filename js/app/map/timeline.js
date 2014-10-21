'use strict';

define(['require', 'd3', 'zepto', 'moment'], function(require, d3, zepto, moment) {
	/**
	 * Constructor for the timeline that accepts the element to use
	 */
	var Timeline = function(el, width, height) {
		this.el = el;
		this.width = width;
		this.height = height;

		this.start = moment().subtract(1, 'year');
		this.end = moment();

		this.eventData = [];
	};

	/**
	 * Set the width of the timeline
	 * @param {number} width
	 */
	Timeline.prototype.setWidth = function(width) {
		this.width = width;

		this.redraw();
	};

	/**
	 * Add an event at the specified time with the specified name and data
	 */
	Timeline.prototype.addEvent = function(time, data) {
		if(data.name.length > 12) {
			console.log('You may want to shorten the event name.');
		}

		this.eventData.push({
			time: time,
			data: data
		});
		this.redraw();
	};

	/**
	 * Resize the timeline based on the current width and height
	 */
	Timeline.prototype.redraw = function() {
		var self = this;

		/**
		 * Backdrop
		 */

		this.backdrop
			.attr('x', this.width * 0.15)
			.attr('y', 0)
			.attr('width', this.width * 0.7)
			.attr('height', this.height)
			.attr('rx', this.height / 2)
			.attr('ry', this.height / 2);

		/**
		 * Current Time Marker
		 */
		this.currentMarker
			.attr('cx', this.width * 0.15 + this.height / 2)
			.attr('cy', this.height / 2)
			.attr('r', 8)
			.attr('class', 'timeline-current-time');

		/**
		 * Event Markers
		 */
		 this.drawEventMarkers();
	};

	Timeline.prototype.drawEventMarkers = function() {
		var self = this;

		var eventMarker = this.eventContainer
			.selectAll('g')
				.data(this.eventData)
				.enter()
					.append('svg')
						.attr('x', function(d) {
							var ratio = (d.time.unix() - self.start.unix()) / (self.end.unix() - self.start.unix());
							return (100 * (0.15 + 0.7 * ratio)) + '%';
						})
						.attr('class', 'timeline-event');

		/**
		 * Add lines, text, and summary
		 */
		
		var lineLength = 125;
		var summaryWidth = 250;

		var lineGroup = eventMarker.append('g')
			.attr('class', 'timeline-event-line-container');
		
		lineGroup
			.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', lineLength)
				.attr('y2', 0)
				.attr('stroke-width', 1)
				.attr('class', 'timeline-event-line');
		
		lineGroup
			.append('text')
				.attr('x', lineLength)
				.attr('y', -3)
				.attr('text-anchor', 'end')
				.attr('class', 'timeline-event-name')
				.text(function(d) {
					return d.data.name;
				});

		var summaryGroup = eventMarker.append('g')
			.attr('transform', function(d) {
				var coords = (Math.sqrt(Math.pow(lineLength, 2) / 2));
				return 'translate(' + coords + ' ' + coords + ')';
			})
			.attr('class', 'timeline-event-summary');

		summaryGroup
			.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', summaryWidth / 4)
				.attr('y2', 0)
				.attr('class', 'timeline-event-summary-line');

		summaryGroup
			.append('text')
				.attr('y', 18)
				.text(function(d) {
					return d.data.description;
				})
				.attr('class', 'timeline-event-summary-value');

		/**
		 * Add actual marker
		 */

		eventMarker
			.append('circle')
				.attr('cx', 0)
				.attr('cy', this.height / 2)
				.attr('r', 24)
				.attr('class', 'timeline-event-outer');

		eventMarker
			.append('circle')
				.attr('cx', 0)
				.attr('cy', this.height / 2)
				.attr('r', 20)
				.attr('class', 'timeline-event-inner');
	};

	/**
	 * Load the timeline
	 */
	Timeline.prototype.load = function() {
		this.container = this.el.append('g');

		this.backdrop = this.container
			.append('rect')
				.attr('class', 'timeline-backdrop');

		this.currentMarker = this.container
			.append('circle');

		this.eventContainer = this.container
			.append('g')
				.attr('class', 'timeline-events');

		this.redraw();
	};

	return Timeline;
});