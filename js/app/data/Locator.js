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
				'latitude': -3.74922,
          		'longitude': 40.46366700000001
			},

			'regions': []
		},

		{
			'names': ['US', 'USA', 'United States', 'United States of America'],
			'coordinates': {
				'latitude': -95.712891,
          		'longitude': 37.09024
			},

			'regions': [
				{
					'names': ['TX', 'Texas'],
					'coordinates': null,

					'cities': [
						{
							'names': ['Dallas'],
							'coordinates': {
								'latitude': -96.80045109999999,
          						'longitude': 32.7801399
							}
						}
					]
				}
			]
		},

		{
			'names': ['CD', 'DRC', 'Democratic Republic of the Congo'],
			'coordinates': null,

			'regions': [
				{
					'names': ['ZZ'],
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