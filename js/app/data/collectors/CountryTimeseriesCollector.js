'use strict';

define(['require', 'moment', 'deepmerge', 'd3'], function(require, moment, deepmerge, d3) {
	/**
	 * URL of the CSV file containing the data
	 * @type {String}
	 */
	var url = 'data/ebola/country_timeseries.csv';

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
		},

		'Cases_SierraLeone': {
			'country': 'SL',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_Nigeria': {
			'country': 'NG',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_Senegal': {
			'country': 'SN',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_UnitedStates': {
			'country': 'US',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_Spain': {
			'country': 'ES',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Cases_Mali': {
			'country': 'ML',
			'region': 'ZZ',
			'type': 'cases'
		},

		'Deaths_Guinea': {
			'country': 'GN',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_Liberia': {
			'country': 'LR',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_SierraLeone': {
			'country': 'SL',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_Nigeria': {
			'country': 'NG',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_Senegal': {
			'country': 'SN',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_UnitedStates': {
			'country': 'US',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_Spain': {
			'country': 'ES',
			'region': 'ZZ',
			'type': 'deaths'
		},

		'Deaths_Mali': {
			'country': 'ML',
			'region': 'ZZ',
			'type': 'deaths'
		}
	};

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
		var self = this;

		d3.csv(url)
			.row(function(d) {
				return self.processRow.call(self, d);
			})
			.get(function(error, data) {
				if(error) {
					throw error;
				}

				callback(self.postProcessData.call(self, data));
			});
	};

	/**
	 * Process the specified row's data
	 * @param  {Object} row Object containing the row's values
	 */
	CountryTimeseriesCollector.prototype.processRow = function(row) {
		var data = {};
		var date = moment(row['Date'], 'M-D-YYYY');
		if(date.get('year') < 100) {
			date = moment(row['Date'], 'M-D-YY');
		}

		date = date.toISOString();

		data[date] = {};

		for(var i in countries) {
			if(countries.hasOwnProperty(i) && row.hasOwnProperty(i)) {
				var country = countries[i].country;
				var region = countries[i].region;
				var type = countries[i].type;

				if(!row[i] || row[i].trim() == '' || parseInt(row[i], 10) == NaN) {
					// The row is not a number, so just skip it.
					continue;
				}

				if(typeof(data[date][country]) == 'undefined') {
					data[date][country] = {};
				}

				if(typeof(data[date][country][region]) == 'undefined') {
					data[date][country][region] = {};
				}

				if(typeof(data[date][country][region]['Unknown']) == 'undefined') {
					data[date][country][region]['Unknown'] = {};
				}

				data[date][country][region]['Unknown'][type] = parseInt(row[i], 10);
			}
		}

		return data;
	};

	/**
	 * Post process the CSV to consolidate the entire set of data into an object,
	 * instead of an array of objects.
	 * @param  {array} data Data
	 * @return {object}     An object containing the post processed data
	 */
	CountryTimeseriesCollector.prototype.postProcessData = function(data) {
		var processedData = {};

		for(var i = 0; i < data.length; i++) {
			for(var date in data[i]) {
				if(data[i].hasOwnProperty(date)) {
					processedData = deepmerge(processedData, data[i]);
				}
			}
		}

		return processedData;
	};

	return CountryTimeseriesCollector;
});