'use strict';

define(['require', 'd3'], function(require, d3) {
	/**
	 * Location to the folder for the Guinea data
	 * @type {String}
	 */
	var dataRoot = 'data/ebola/guinea_data/';

	/**
	 * File names for the data files
	 * @type {Array}
	 */
	var dataFiles = [
		'ebola_guinea_01Oct2014.csv',
		'ebola_guinea_04Aug2014.csv',
		'ebola_guinea_07Sep2014.csv',
		'ebola_guinea_16Sept2014.csv',
		'ebola_guinea_27Aug2014.csv',
		'ebola_guinea_30Aug2014.csv',
		'ebola_guinea_31Aug2014.csv'
	];

	/**
	 * Country code
	 * @type {String}
	 */
	var country = 'GN';

	/**
	 * Region code
	 * @type {String}
	 */
	var region = 'ZZ';

	var GuineaCollector = function() {

	};

	/**
	 * Retrieve the data for the United States
	 */
	GuineaCollector.prototype.collect = function(callback) {
		var collectedData = {};
		var completed = 0;

		for(var i = 0; i < dataFiles.length; i++) {
			d3.csv(dataRoot + dataFiles[i])
				.row(function(d) {
					var date = moment(d.Date, 'YYYY-MM-DD');

					if(!collectedData.hasOwnProperty(date.format())) {
						collectedData[date.format()] = {};
					}

					var field = null;
					if(d.Description == 'Total cases of confirmed') {
						field = 'cases';
					} else if(d.Description == 'Total deaths of confirmed') {
						field = 'deaths';
					}

					for(var n in d) {
						if(!d.hasOwnProperty(n) || n == 'Date' || n == 'Description' || isNaN(parseInt(d[n], 10)) || field == null) {
							continue;
						}

						if(!collectedData[date.format()].hasOwnProperty(country)) {
							collectedData[date.format()][country] = {};
						}

						if(!collectedData[date.format()][country].hasOwnProperty(region)) {
							collectedData[date.format()][country][region] = {};
						}

						var city = n == 'Totals' ? 'Unknown' : n;

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

	return GuineaCollector;
});