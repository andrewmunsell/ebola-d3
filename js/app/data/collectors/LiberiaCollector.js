'use strict';

define(['require', 'd3'], function(require, d3) {
	/**
	 * Location to the folder for the Liberia data
	 * @type {String}
	 */
	var dataRoot = 'data/ebola/liberia_data/';

	/**
	 * File names for the data files
	 * @type {Array}
	 */
	var dataFiles = [
		'2014-06-16.csv',
		'2014-06-17.csv',
		'2014-06-22.csv',
		'2014-06-24.csv',
		'2014-06-25.csv',
		'2014-06-28.csv',
		'2014-06-29.csv',
		'2014-07-01.csv',
		'2014-07-02.csv',
		'2014-07-03.csv',
		'2014-07-07.csv',
		'2014-07-08.csv',
		'2014-07-10.csv',
		'2014-07-13.csv',
		'2014-07-17.csv',
		'2014-07-20.csv',
		'2014-07-24.csv',
		'2014-07-26.csv',
		'2014-08-02.csv',
		'2014-08-04.csv',
		'2014-08-12.csv',
		'2014-08-15.csv',
		'2014-08-17.csv',
		'2014-08-18.csv',
		'2014-08-20.csv',
		'2014-08-25.csv',
		'2014-08-28.csv',
		'2014-09-01.csv',
		'2014-09-02.csv',
		'2014-09-03.csv',
		'2014-09-04.csv',
		'2014-09-05.csv',
		'2014-09-06.csv',
		'2014-09-07.csv',
		'2014-09-08.csv',
		'2014-09-10.csv',
		'2014-09-11.csv',
		'2014-09-12.csv',
		'2014-09-13.csv',
		'2014-09-14.csv',
		'2014-09-15.csv',
		'2014-09-16.csv',
		'2014-09-17-v125.csv',
		'2014-09-20-v128.csv',
		'2014-09-21-v129.csv',
		'2014-09-23-v131.csv',
		'2014-09-25-v133.csv',
		'2014-09-26-v134.csv',
		'2014-09-27-v135.csv',
		'2014-09-28-v136.csv',
		'2014-09-30-v138.csv',
		'2014-10-01-v139.csv',
		'2014-10-03-v141.csv',
		'2014-10-04-v142.csv',
		'2014-10-05-v143.csv',
		'2014-10-07-v145.csv',
		'2014-10-08-v146.csv',
		'2014-10-09-v147.csv',
		'2014-10-10-v148.csv',
		'2014-10-11-v149.csv',
		'2014-10-12-v150.csv',
		'2014-10-13-v151.csv',
		'2014-10-16-v154.csv',
		'2014-10-17-v155.csv',
		'2014-10-18-v156.csv',
		'2014-10-19-v157.csv',
		'2014-10-20-v158.csv',
		'2014-10-21-v159.csv',
		'2014-10-22-v160.csv',
		'2014-10-23-v161.csv',
		'2014-10-24-v162.csv',
		'2014-10-25-v163.csv',
		'2014-10-27-v165.csv',
		'2014-10-28-v166.csv',
		'2014-10-29-v167.csv',
		'2014-10-30-v168.csv',
		'2014-10-31-v169.csv',
		'2014-11-02-v171.csv',
		'2014-11-04-v173.csv',
		'2014-11-08-v177.csv'
	];

	/**
	 * Country code
	 * @type {String}
	 */
	var country = 'LR';

	/**
	 * Region code
	 * @type {String}
	 */
	var region = 'ZZ';

	var LiberiaCollector = function() {

	};

	/**
	 * Retrieve the data for the United States
	 */
	LiberiaCollector.prototype.collect = function(callback) {
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
					if(d.Variable == 'Total confirmed cases') {
						field = 'cases';
					} else if(d.Variable == 'Total death/s in confirmed cases') {
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

	return LiberiaCollector;
});