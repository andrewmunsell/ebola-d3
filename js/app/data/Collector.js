'use strict';

define(['require', 'deepmerge', 'nprogress', './Locator'], function(require, deepmerge, Nprogress, Locator) {
	var collectors = [
		'./collectors/CountryTimeseriesCollector',
		'./collectors/USATimeseriesCollector',
		'./collectors/DRCCollector',
		'./collectors/LiberiaCollector',
		'./collectors/GuineaCollector',
		'./collectors/SLCollector'
	];

	/**
	 * Constructor for the Collector, which aggregates the different data collectors
	 * into a single data set that can be presented.
	 *
	 * Data is formatted as follows:
	 *
	 * {
	 * 		"2014-10-21T21:44:00Z": {
	 * 			"US": {
	 * 				"TX": {
	 * 					"Dallas": {
	 * 						"cases": 3,
	 * 						"deaths": 1	
	 * 					}
	 * 				}
	 * 			}
	 * 		}
	 * }
	 *
	 * Each time set is identified by its ISO date time stamp. Underneath each time is an ISO 3166-1 
	 * country code, which contains an 2-letter region code if available. If no region is available
	 * or known, the identifier "ZZ" is used instead. Inside of the region data is the city level data.
	 * Unknown cities are simply identified as "Unknown". Unknown countries are not represented in the 
	 * data set.
	 *
	 * If a dataset has only county/state/subregion data, then the collector should aggregate the values
	 * into the ZZ/Unknown subregion-city to provide an overview of the country's cases/deaths.
	 */
	var Collector = function() {
		this.locator = new Locator();
		this.progress = 0;
	};

	/**
	 * Collect data from all of the collectors and resolve the promise with the aggregated
	 * values.
	 */
	Collector.prototype.collect = function(callback) {
		var self = this;

		Nprogress.start();

		require(collectors, function() {
			var requiredResults = arguments.length;

			var results = [];
			var currentResults = 0;

			var finishPiece = function(i) {
				return function(result) {
					results[i] = result;
					currentResults++;

					self.progress = currentResults / requiredResults;
					Nprogress.set(self.progress);

					if(currentResults == requiredResults) {
						self.processCollectors.call(self, results, callback);
					}
				}
			};

			for(var i = 0; i < arguments.length; i++) {
				var collector = new (arguments[i])();
				collector.collect(finishPiece(i));
			}
		});
	};

	/**
	 * Process the data from the collectors
	 * @param  {array}   results   Results from each collector to aggregate into a single dataset
	 * @param  {Function} callback Callback to invoke when the results are aggregated
	 */
	Collector.prototype.processCollectors = function(results, callback) {
		if(typeof(callback) != 'function') {
			throw new Error('The specified callback is not a function.');
		}

		var data = {};

		for(var i = 0; i < results.length; i++) {
			var result = results[i];

			for(var d in result) {
				if(result.hasOwnProperty(d)) {
					if(data.hasOwnProperty(d)) {
						data[d] = deepmerge(data[d], result[d]);
					} else {
						data[d] = result[d];
					}
				}
			}
		}

		Nprogress.done();

		callback(data);
	};

	return Collector;
});