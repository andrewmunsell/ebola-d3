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
			}
		},

		{
			'names': ['GN', 'Guinea'],
			'coordinates': {
				'latitude': 11.0346436,
				'longitude': -11.3580295
			}
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