'use strict';

define(['require'], function(require) {
	/**
	 * Map of the column name to the country and region codes
	 * as well as the type of data the number represents
	 * @type {Object}
	 */
	var countries = {
		'Cases_Guinea': {
			'country': 'GN',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_Liberia': {
			'country': 'LR',
			'region': 'ZZ',
			'type': 'cases'
		}
	}

	/**
	 * Data collector that parses the country_timeseries.csv file
	 */
	var CountryTimeseriesCollector = function() {

	};

	/**
	 * Collect data and perform a callback when the data collection is finished
	 * @param  {Function} callback Callback that will accept and error and result, or null
	 *                             and result if there was no error.
	 * @return {Q.promise}
	 */
	CountryTimeseriesCollector.prototype.collect = function(callback) {
		
	};

	return CountryTimeseriesCollector;
});