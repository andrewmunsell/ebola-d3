'use strict';

define(['require', 'd3', 'zepto'], function(require, d3, zepto) {
	/**
	 * Constructor for the timeline that accepts the element to use
	 */
	var Timeline = function(el, width, height) {
		this.el = el;
		this.width = width;
		this.height = height;
	};

	/**
	 * Set the width of the timeline
	 * @param {number} width
	 */
	Timeline.prototype.setWidth = function(width) {
		this.width = width;

		this.resize();
	};

	Timeline.prototype.resize = function() {
		this.backdrop
			.attr('x', this.width * 0.15)
			.attr('y', 0)
			.attr('width', this.width * 0.7)
			.attr('height', this.height)
			.attr('rx', this.height / 2)
			.attr('ry', this.height / 2)
	};

	/**
	 * Load the timeline
	 */
	Timeline.prototype.load = function() {
		var self = this;

		this.backdrop = this.el.append('g')
			.append('rect')
				.attr('class', 'timeline-backdrop');

		this.resize();
	};

	return Timeline;
});