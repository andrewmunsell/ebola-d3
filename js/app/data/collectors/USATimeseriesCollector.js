'use strict';

define(['require', 'd3'], function(require, d3) {
	/**
	 * Location to the data file for the USA
	 * @type {String}
	 */
	var dataFile = 'data/ebola-manual/usa.json';

	var USATimeseriesCollector = function() {

	};

	/**
	 * Retrieve the data for the United States
	 */
	USATimeseriesCollector.prototype.collect = function(callback) {
		d3.json(dataFile, function(err, json) {
			if(!err) {
				callback(json);
			} else {
				throw err;
			}
		})
	};

	return USATimeseriesCollector;
});