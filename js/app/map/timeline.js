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
	};

	/**
	 * Load the timeline
	 */
	Timeline.prototype.load = function() {
		
	};

	return Timeline;
});