'use strict';

define(['require', 'd3'], function(require, d3) {
	/**
	 * Location to the folder for the SL data
	 * @type {String}
	 */
	var dataRoot = 'data/ebola/sl_data/';

	/**
	 * File names for the data files
	 * @type {Array}
	 */
	var dataFiles = [
		'2014-08-12-v77.csv',
		'2014-08-13-v78.csv',
		'2014-08-14-v79.csv',
		'2014-08-15-v80.csv',
		'2014-08-16-v81.csv',
		'2014-08-17-v82.csv',
		'2014-08-18-v83.csv',
		'2014-08-19-v84.csv',
		'2014-08-20-v85.csv',
		'2014-08-21-v86.csv',
		'2014-08-22-v87.csv',
		'2014-08-23-v88.csv',
		'2014-08-24-v89.csv',
		'2014-08-25-v90.csv',
		'2014-08-26-v91.csv',
		'2014-08-27-v92.csv',
		'2014-08-28-v93.csv',
		'2014-08-29-v94.csv',
		'2014-08-30-v95.csv',
		'2014-08-31-v96.csv',
		'2014-09-01-v97.csv',
		'2014-09-02-v98.csv',
		'2014-09-03-v99.csv',
		'2014-09-05-v101.csv',
		'2014-09-06-v102.csv',
		'2014-09-07-v103.csv',
		'2014-09-08-v104.csv',
		'2014-09-09-v105.csv',
		'2014-09-10-v106.csv',
		'2014-09-11-v107.csv',
		'2014-09-12-v108.csv',
		'2014-09-13-v109.csv',
		'2014-09-14-v110.csv',
		'2014-09-15-v111.csv',
		'2014-09-16-v112.csv',
		'2014-09-17-v113.csv',
		'2014-09-18-v114.csv',
		'2014-09-19-v115.csv',
		'2014-09-20-v116.csv',
		'2014-09-21-v117.csv',
		'2014-09-22-v118.csv',
		'2014-09-23-v119.csv',
		'2014-09-24-v120.csv',
		'2014-09-25-v121.csv',
		'2014-09-26-v122.csv',
		'2014-09-27-v123.csv',
		'2014-09-28-v124.csv',
		'2014-09-29-v125.csv',
		'2014-09-30-v126.csv',
		'2014-10-01-v127.csv',
		'2014-10-03-v129.csv',
		'2014-10-04-v130.csv',
		'2014-10-05-v131.csv',
		'2014-10-06-v132.csv',
		'2014-10-07-v133.csv',
		'2014-10-08-v134.csv',
		'2014-10-10-v136.csv',
		'2014-10-11-v137.csv',
		'2014-10-12-v138.csv',
		'2014-10-12-v139.csv',
		'2014-10-15-v140.csv',
		'2014-10-17-v142.csv',
		'2014-10-18-v143.csv',
		'2014-10-19-v144.csv',
		'2014-10-20-v145.csv',
		'2014-10-21-v146.csv',
		'2014-10-22-v147.csv',
		'2014-10-23-v148.csv',
		'2014-10-24-v149.csv',
		'2014-10-25-v150.csv',
		'2014-10-26-v151.csv',
		'2014-10-27-v152.csv',
		'2014-10-28-v153.csv',
		'2014-10-29-v154.csv',
		'2014-10-31-v156.csv',
		'2014-11-01-v157.csv',
		'2014-11-02-v158.csv',
		'2014-11-03-v159.csv',
		'2014-11-06-v163.csv',
		'2014-11-10.csv',
		'2014-11-11.csv',
		'2014-11-13.csv',
		'2014-11-14.csv'
	];

	/**
	 * Country code
	 * @type {String}
	 */
	var country = 'SL';

	/**
	 * Region code
	 * @type {String}
	 */
	var region = 'ZZ';

	var SLCollector = function() {

	};

	/**
	 * Retrieve the data for the United States
	 */
	SLCollector.prototype.collect = function(callback) {
		var collectedData = {};
		var completed = 0;

		for(var i = 0; i < dataFiles.length; i++) {
			d3.csv(dataRoot + dataFiles[i])
				.row(function(d) {
					var date = moment(d.date, 'YYYY-MM-DD');

					if(!collectedData.hasOwnProperty(date.format())) {
						collectedData[date.format()] = {};
					}

					var field = null;
					if(d.variable == 'cum_confirmed') {
						field = 'cases';
					} else if(d.variable == 'death_confirmed') {
						field = 'deaths';
					}

					for(var n in d) {
						if(!d.hasOwnProperty(n) || n == 'date' || n == 'variable' || isNaN(parseInt(d[n], 10)) || field == null) {
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

	return SLCollector;
});