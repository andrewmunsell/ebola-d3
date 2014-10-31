'use strict';

define(['require', 'd3'], function(require, d3) {
	/**
	 * Location to the folder for the DRC data
	 * @type {String}
	 */
	var dataRoot = 'data/ebola/drcongo_data/csv/';

	/**
	 * File names for the data files
	 * @type {Array}
	 */
	var dataFiles = [
		'drc_case_data-Sept-21-2014.csv',
		'drc_case_data-Sept-29-2014.csv',
		'drc_case_data-Oct-7-2014.csv'
	];

	/**
	 * Country code
	 * @type {String}
	 */
	var country = 'CD';

	/**
	 * Region code
	 * @type {String}
	 */
	var region = 'ZZ';

	var DRCCollector = function() {

	};

	/**
	 * Retrieve the data for the United States
	 */
	DRCCollector.prototype.collect = function(callback) {
		var collectedData = {};
		var completed = 0;

		for(var i = 0; i < dataFiles.length; i++) {
			d3.csv(dataRoot + dataFiles[i])
				.row(function(d) {
					var date = d.Date.split('/');
					if(parseInt(date[2], 10) < 100) {
						date = moment.utc(date, 'MM/DD/YY');
					} else {
						date = moment.utc(date, 'MM/DD/YYYY');
					}

					if(!collectedData.hasOwnProperty(date.format())) {
						collectedData[date.format()] = {};
					}

					var field = null;
					if(d.Variable == 'Number of registered cases') {
						field = 'cases';
					} else if(d.Variable == 'Number of deaths') {
						field = 'deaths';
					}

					for(var n in d) {
						if(!d.hasOwnProperty(n) || n == 'Date' || n == 'Variable' || isNaN(parseInt(d[n], 10)) || field == null) {
							continue;
						}

						if(!collectedData[date.format()].hasOwnProperty(country)) {
							collectedData[date.format()][country] = {};
						}

						if(!collectedData[date.format()][country].hasOwnProperty(region)) {
							collectedData[date.format()][country][region] = {};
						}

						var city = n == 'National' ? 'Unknown' : n;

						if(!collectedData[date.format()][country][region].hasOwnProperty(city)) {
							collectedData[date.format()][country][region][city] = {};
						}

						collectedData[date.format()][country][region][city][field] = parseInt(d[n], 10);
					}

					return d;
				})
				.get(function(err, csv) {
					if(!err) {
						completed++;
					}

					if(completed == dataFiles.length) {
						callback(collectedData);
					}
				});
		}
	};

	return DRCCollector;
});