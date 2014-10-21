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
		 * Event Markers
		 */

		var eventMarker = this.eventContainer
			.selectAll('g')
				.data(this.eventData)
				.enter()
					.append('g');

		eventMarker
			.append('circle')
				.attr('cx', function(d) {
					var ratio = (d.time.unix() - self.start.unix()) / (self.end.unix() - self.start.unix());
					return (100 * (0.15 + 0.7 * ratio)) + '%';
				})
				.attr('cy', this.height / 2)
				.attr('r', 24)
				.attr('class', 'timeline-event-outer');

		eventMarker
			.append('circle')
				.attr('cx', function(d) {
					var ratio = (d.time.unix() - self.start.unix()) / (self.end.unix() - self.start.unix());
					return (100 * (0.15 + 0.7 * ratio)) + '%';
				})
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
			.append('circle')
				.attr('cx', this.width * 0.15 + this.height / 2)
				.attr('cy', this.height / 2)
				.attr('r', 8)
				.attr('class', 'timeline-current-time');

		this.eventContainer = this.container
			.append('g')
				.attr('class', 'timeline-events');

		this.redraw();
	};

	return Timeline;
});