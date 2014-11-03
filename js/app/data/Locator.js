'use strict';

define(['require', 'underscore'], function(require, _) {
	/**
	 * Dictionary of locations
	 * @type {Array}
	 */
	var locations = [
		{
			'names': ['ES', 'Spain'],
			'coordinates': {
				'longitude': -3.74922,
          		'latitude': 40.46366700000001
			},

			'regions': []
		},

		{
			'names': ['US', 'USA', 'United States', 'United States of America'],
			'coordinates': {
				'longitude': -95.712891,
          		'latitude': 37.09024
			},

			'regions': [
				{
					'names': ['TX', 'Texas'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Dallas'],
							'coordinates': {
								'longitude': -96.80045109999999,
          						'latitude': 32.7801399
							}
						}
					]
				},

				{
					'names': ['NY', 'New York'],
					'coordinates': null,

					'cities': [
						{
							'names': ['New York City'],
							'coordinates': {
								'latitude': 40.762734,
								'longitude': -73.9634123
							}
						}
					]
				}
			]
		},

		{
			'names': ['CD', 'DRC', 'Democratic Republic of the Congo'],
			'coordinates': {
				'latitude': -2.8652521,
				'longitude': 23.5092615
			},

			'regions': [
				{
					'names': ['ZZ'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Lokolia'],
							'coordinates': {
								'latitude': -0.583,
								'longitude': 20.550
							}
						},

						{
							'names': ['Watsikengo', 'Watsi kengo', 'Watsi Kengo'],
							'coordinates': {
								'latitude': -0.800,
								'longitude': 20.550
							}
						}
					]
				}
			]
		},

		{
			'names': ['LR', 'Liberia'],
			'coordinates': {
				'latitude': 6.3740379,
				'longitude': -9.3377105
			},

			'regions': [
				{
					'names': ['ZZ'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Bomi County', 'Bomi'],
							'coordinates': {
								'latitude': 6.725008,
								'longitude': -10.7842821
							}
						},

						{
							'names': ['Bong County', 'Bong'],
							'coordinates': {
								'latitude': 6.913798,
								'longitude': -9.7855304
							}
						},

						{
							'names': ['Gbarpolu County', 'Gbarpolu'],
							'coordinates': {
								'latitude': 7.413882,
								'longitude': -10.29491
							}
						},

						{
							'names': ['Grand Bassa'],
							'coordinates': {
								'latitude': 6.1431823,
								'longitude': -9.7004294
							}
						},

						{
							'names': ['Grand Cape Mount'],
							'coordinates': {
								'latitude': 7.0525151,
								'longitude': -11.0013541
							}
						},

						{
							'names': ['Grand Gedeh'],
							'coordinates': {
								'latitude': 6.00994,
								'longitude': -8.2300904
							}
						},

						{
							'names': ['Grand Kru'],
							'coordinates': {
								'latitude': 4.833782,
								'longitude': -8.2185915
							}
						},

						{
							'names': ['Lofa County'],
							'coordinates': {
								'latitude': 7.8653131,
								'longitude': -9.9749765
							}
						},

						{
							'names': ['Margibi County'],
							'coordinates': {
								'latitude': 6.4754276,
								'longitude': -10.185051
							}
						},

						{
							'names': ['Maryland County'],
							'coordinates': {
								'latitude': 4.7424822,
								'longitude': -7.8004456
							}
						},

						{
							'names': ['Montserrado County'],
							'coordinates': {
								'latitude': 6.535922,
								'longitude': -10.661278
							}
						},

						{
							'names': ['Nimba County'],
							'coordinates': {
								'latitude': 6.7599786,
								'longitude': -8.7453026
							}
						},

						{
							'names': ['River Gee County'],
							'coordinates': {
								'latitude': 5.2069539,
								'longitude': -7.846679
							}
						},

						{
							'names': ['RiverCess County', 'Rivercess County'],
							'coordinates': {
								'latitude': 5.82426,
								'longitude': -9.3959225
							}
						},

						{
							'names': ['Sinoe County'],
							'coordinates': {
								'latitude': 5.32463,
								'longitude': -8.8263339
							}
						}
					]
				}
			]
		},

		{
			'names': ['SL', 'Sierra Leone'],
			'coordinates': {
				'latitude': 8.4494988,
				'longitude': -11.7868289
			},

			'regions': [
				{
					'names': ['ZZ'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Kailahun'],
							'coordinates': {
								'latitude': 8.2795935,
								'longitude': -10.5726026
							}
						},

						{
							'names': ['Kenema'],
							'coordinates': {
								'latitude': 7.8639323,
								'longitude': -11.204338
							}
						},

						{
							'names': ['Kono'],
							'coordinates': {
								'latitude': 8.7082969,
								'longitude': -10.9350013
							}
						},

						{
							'names': ['Kambia'],
							'coordinates': {
								'latitude': 9.1184634,
								'longitude': -12.9177171
							}
						},

						{
							'names': ['Koinadugu'],
							'coordinates': {
								'latitude': 9.5166954,
								'longitude': -11.36363
							}
						},

						{
							'names': ['Bombali'],
							'coordinates': {
								'latitude': 9.3133539,
								'longitude': -12.1955108
							}
						},

						{
							'names': ['Tonkolili'],
							'coordinates': {
								'latitude': 8.7924906,
								'longitude': -12.0480538
							}
						},

						{
							'names': ['Port Loko'],
							'coordinates': {
								'latitude': 8.770191,
								'longitude': -12.7868629
							}
						},

						{
							'names': ['Pujehun'],
							'coordinates': {
								'latitude': 7.3551035,
								'longitude': -11.7223263
							}
						},

						{
							'names': ['Bo'],
							'coordinates': {
								'latitude': 7.9547279,
								'longitude': -11.7293215
							}
						},

						{
							'names': ['Moyamba'],
							'coordinates': {
								'latitude': 8.1588491,
								'longitude': -12.4338949
							}
						},

						{
							'names': ['Bonthe'],
							'coordinates': {
								'latitude': 7.5290301,
								'longitude': -12.5056654
							}
						},

						{
							'names': ['Western area urban'],
							'coordinates': {
								'latitude': 8.4361647,
								'longitude': -13.2356945
							}
						},

						{
							'names': ['Western area rural'],
							'coordinates': {
								'latitude': 8.2838108,
								'longitude': -13.0837358
							}
						}
					]
				}
			]
		},

		{
			'names': ['GN', 'Guinea'],
			'coordinates': {
				'latitude': 11.0346436,
				'longitude': -11.3580295
			},

			'regions': [
				{
					'names': ['ZZ'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Conakry'],
							'coordinates': {
								'latitude': 9.6353827,
								'longitude': -13.5759213
							}
						},

						{
							'names': ['Gueckedou'],
							'coordinates': {
								'latitude': 8.5652126,
								'longitude': -10.1247811
							}
						},

						{
							'names': ['Macenta'],
							'coordinates': {
								'latitude': 8.5398564,
								'longitude': -9.4662665
							}
						},

						{
							'names': ['Dabola'],
							'coordinates': {
								'latitude': 10.7311993,
								'longitude': -11.1101389
							}
						},

						{
							'names': ['Kissidougou'],
							'coordinates': {
								'latitude': 9.1902231,
								'longitude': -10.1008988
							}
						},

						{
							'names': ['Dinguiraye'],
							'coordinates': {
								'latitude': 11.2912107,
								'longitude': -10.711305
							}
						},

						{
							'names': ['Telimele'],
							'coordinates': {
								'latitude': 10.90668,
								'longitude': -13.0342483
							}
						},

						{
							'names': ['Boffa'],
							'coordinates': {
								'latitude': 10.1831174,
								'longitude': -14.0381241
							}
						},

						{
							'names': ['Kouroussa'],
							'coordinates': {
								'latitude': 10.6492622,
								'longitude': -9.8833661
							}
						},

						{
							'names': ['Siguiri'],
							'coordinates': {
								'latitude': 11.4164092,
								'longitude': -9.176073
							}
						},

						{
							'names': ['Pita'],
							'coordinates': {
								'latitude': 11.0536547,
								'longitude': -12.3929214
							}
						},

						{
							'names': ['Nzerekore'],
							'coordinates': {
								'latitude': 7.7591274,
								'longitude': -8.8128376
							}
						},

						{
							'names': ['Yomou'],
							'coordinates': {
								'latitude': 7.5688842,
								'longitude': -9.2579127
							}
						},

						{
							'names': ['Dubreka'],
							'coordinates': {
								'latitude': 10.130317,
								'longitude': -13.539201
							}
						},

						{
							'names': ['Forecariah'],
							'coordinates': {
								'latitude': 9.4326255,
								'longitude': -13.08791
							}
						},

						{
							'names': ['Kerouane'],
							'coordinates': {
								'latitude': 9.2697347,
								'longitude': -9.0084028
							}
						},

						{
							'names': ['Coyah'],
							'coordinates': {
								'latitude': 9.7057079,
								'longitude': -13.390737
							}
						},

						{
							'names': ['Dalaba'],
							'coordinates': {
								'latitude': 10.6887947,
								'longitude': -12.2498363
							}
						},

						{
							'names': ['Beyla'],
							'coordinates': {
								'latitude': 8.6897236,
								'longitude': -8.6440515
							}
						},

						{
							'names': ['Kindia'],
							'coordinates': {
								'latitude': 10.0472874,
								'longitude': -12.8566217
							}
						},

						{
							'names': ['Lola'],
							'coordinates': {
								'latitude': 7.8025045,
								'longitude': -8.5298849
							}
						}
					]
				}
			]
		},

		{
			'names': ['NG', 'Nigeria'],
			'coordinates': {
				'latitude': 9.077751,
				'longitude': 8.6774567
			}
		},

		{
			'names': ['SN', 'Senegal'],
			'coordinates': {
				'latitude': 14.5,
				'longitude': -14.4392276
			}
		},

		{
			'names': ['ML', 'Mali'],
			'coordinates': {
				'latitude': 18.2606722,
				'longitude': -1.9655477
			}
		}
	];

	/**
	 * Locator that transforms a country code (ISO-3166 Alpha 2) or location name
	 * (full name of the country, alias used in the data sets) and returns a latitude
	 * and longitude for the location.
	 */
	var Locator = function() {

	};

	/**
	 * Retrieve the latitude and longitude of the specified location name
	 * @param  {string} country Country code or name for the location to find
	 * @param  {string} region  Region code or name for the location to find
	 * @param  {string} city	City name
	 * @return {object}      	Object containing the latitude and longitude of the
	 *                          location.
	 */
	Locator.prototype.locate = function(country, region, city) {
		var coordinates = null;

		for (var i = locations.length - 1; i >= 0; i--) {
			var countryIndex = _.indexOf(locations[i].names, country);
			if(countryIndex >= 0) {
				if(locations[i].coordinates != null) {
					coordinates = locations[i].coordinates;
				}

				if(locations[i].regions != null) {
					var regionCoordinates = this.locateRegion(locations[i].regions, region, city);
					if(regionCoordinates != null) {
						coordinates = regionCoordinates;
					}
				}

				break;
			}
		};

		return coordinates;
	};

	/**
	 * Locate the specified region
	 * @param  {string} region ISO code or name of the region
	 */
	Locator.prototype.locateRegion = function(regions, region, city) {
		var coordinates = null;

		for (var i = regions.length - 1; i >= 0; i--) {
			var regionIndex = _.indexOf(regions[i].names, region);
			if(regionIndex >= 0) {
				if(regions[i].coordinates != null) {
					coordinates = regions[i].coordinates;
				}

				if(regions[i].cities != null) {
					var cityCoordinates = this.locateCity(regions[i].cities, city);
					if(cityCoordinates != null) {
						coordinates = cityCoordinates;
					}
				}

				break;
			}
		};

		return coordinates;
	};

	/**
	 * Locate the specified city
	 * @param  {string} city Name of the city
	 */
	Locator.prototype.locateCity = function(cities, city) {
		if(city.toLowerCase() == 'unknown' || city == null) {
			// If the city is unknown we obviously don't have a specific set of
			// coordinates for it, so we don't even bother looping over the cities
			return null;
		}

		for (var i = cities.length - 1; i >= 0; i--) {
			var cityIndex = _.indexOf(cities[i].names, city);
			if(cityIndex >= 0) {
				if(cities[i].coordinates != null) {
					return cities[i].coordinates;
				} else {
					return null;
				}
			}
		};

		return null;
	};

	return Locator;
});