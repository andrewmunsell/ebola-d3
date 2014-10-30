'use strict';

define(['require', 'zepto', 'moment', 'd3', 'topojson', '../data/Locator'], function(require, $, moment, d3, topojson, Locator) {
	/**
	 * Path to the TopoJSON file to use for the map
	 * @type {String}
	 */
	var dataFile = 'data/maps/world-110m.json';

	/**
	 * Maximum latitude of the map to prevent scrolling past the poles
	 * @type {Number}
	 */
	var maxLatitude = 83;

	/**
	 * Locator instance for the map
	 * @type {Locator}
	 */
	var locator = new Locator();

	/**
	 * Current date the map is displaying data for
	 * @type {moment}
	 */
	var currentDate = moment();

	/**
	 * Minimum cases and deaths for interpolation of point sizes
	 * @type {Object}
	 */
	var minimums = {
		cases: 0,
		deaths: 0
	};

	/**
	 * Maximum cases and deaths for interpolation of point sizes
	 * @type {Object}
	 */
	var maximums = {
		cases: 0,
		deaths: 0
	};

	/**
	 * Initialize a new map with the specified element. 
	 * 
	 * @url http://bl.ocks.org/patricksurry/6621971 Map panning and zooming functionality
	 * reference
	 */
	var Map = function(el, w, h) {
		if(typeof(w) != 'number' || typeof(h) != 'number') {
			throw new Error('The width and height must be specified.');
		}

		this.el = el;
		this.width = w;
		this.height = h;

		this.rotate = 60;

		this.lastTranslation = [0, 0];
		this.lastScale = null;

		this.projection = d3.geo.mercator()
			.scale(1)
			.rotate([this.rotate, 0])
			.translate([this.width / 2, this.height / 2]);

		var bounds = this.bounds();

		this.scale = this.width / (bounds[1][0] - bounds[0][0]),
		this.scaleExtent = [this.scale, this.scale * 10];

		this.projection.scale(this.scaleExtent[0]);

		this.path = d3.geo.path()
			.projection(this.projection);

		this.el.call(this.setupZoom());
	};

	/**
	 * Set the width of the map
	 * @param {number} width
	 */
	Map.prototype.setWidth = function(width) {
		this.width = width;
	};

	/**
	 * Set the height of the map
	 * @param  {number} height
	 */
	Map.prototype.setHeight = function(height) {
		this.height = height;
	};

	/**
	 * Setup the zoom behavior
	 */
	Map.prototype.setupZoom = function() {
		return d3.behavior.zoom()
			.scaleExtent(this.scaleExtent)
			.scale(this.projection.scale())
			.on('zoom', this.redraw.bind(this));
	};

	/**
	 * Redraw the map
	 */
	Map.prototype.redraw = function() {
		if (d3.event) { 
			var scale = d3.event.scale,
			t = d3.event.translate;

			// if scaling changes, ignore translation (otherwise touch zooms are weird)
			if (scale != this.lastScale) {
				this.projection.scale(scale);
			} else {
				var dx = t[0] - this.lastTranslation[0],
				dy = t[1] - this.lastTranslation[1],
				yaw = this.projection.rotate()[0],
				tp = this.projection.translate();

				// use x translation to rotate based on current scale
				this.projection.rotate([yaw + 360 * dx / this.width * this.scaleExtent[0] / scale, 0, 0]);
				// use y translation to translate this.projection, clamped by min/max
				var b = this.bounds();

				if (b[0][1] + dy > 0) {
					dy = -b[0][1];
				} else if (b[1][1] + dy < this.height) {
					dy = this.height - b[1][1];
				}
				this.projection.translate([tp[0],tp[1]+dy]);
			}

			this.lastScale = scale;
			this.lastTranslation = t;
		}

		this.el.selectAll('path') 
			.attr('d', this.path);

		this.plotPoints();
	};

	/**
	 * Find the top left and bottom right of the projection
	 * @return {array}
	 */
	Map.prototype.bounds = function() {
		var yaw = this.projection.rotate()[0];
		var xymin = this.projection([-yaw - 180 + 1e-6, maxLatitude]);
		var xymax = this.projection([-yaw + 180 - 1e-6, -maxLatitude]);

		return [xymin, xymax];
	};

	/**
	 * Load the JSON for the map
	 */
	Map.prototype.load = function() {
		var self = this;

		d3.json(dataFile, function(error, world) {
			$('main').addClass('loaded');

			self.el.selectAll('path')
				.data(topojson.feature(world, world.objects.countries).features)
				.enter()
					.append('path')
						.attr('class', function(data) {
							return 'country feature-' + data.id;
						});

			self.redraw.call(self);
		});

		require(['../data/Collector'], function(Collector) {
			var collector = new Collector();
			collector.collect(function(data) {
				self.initPoints.call(self, data);
			});
		});
	};

	/**
	 * Initialize the points on the map from the specified dataset
	 * @param  {object} data Data to plot
	 */
	Map.prototype.initPoints = function(data) {
		var arrayData = this.processPoints(data);

		this.el.selectAll('circle')
			.data(arrayData)
			.enter()
				.append('circle')
					.attr('r', 5)
					.attr('class', function(d) {
						return 'ping ' + d.code;
					});

		this.plotPoints(arrayData);
	};

	/**
	 * Process the object containing the data for the points with keys as the date and
	 * values as the countries and subpoint data, transforming it into an array of data points
	 * with one array item per location.
	 *
	 * Each country will have a set of aggregate statistics, and if available, each state/subregion
	 * and city will have its own data point that will be used at higher zoom levels.
	 *
	 * Yes, this is an absolute mess of nested for loops. I could use recursion, but that's for the
	 * future if this is too unweildly.
	 * 
	 * @param  {object} data Object containing the data
	 * @return {array}       Array of data points, with one point per country and subregion/city
	 */
	Map.prototype.processPoints = function(data) {
		// Convert the date based data format into a country based format so that
		// we can perform lookups quickly (i.e. it's a hash table, versus looping
		// over things repeatedly).
		var processedData = {};

		var putData = function(code, type, date, data) {
			if(processedData.hasOwnProperty(code)) {
				// If the data for the current date already exists on the specified point,
				// we can just overwrite it.
				processedData[code]['data'][date] = data;
			} else {
				processedData[code] = {
					type: type,
					data: {}
				};

				processedData[code]['data'][date] = data;
			}

			if(typeof(data.cases) == 'number' && data.cases < minimums.cases) {
				minimums.cases = data.cases;
			} else if(typeof(data.cases) == 'number' && data.cases > maximums.cases) {
				maximums.cases = data.cases;
			}

			if(typeof(data.deaths) == 'number' && data.deaths < minimums.deaths) {
				minimums.deaths = data.deaths;
			} else if(typeof(data.deaths) == 'number' && data.deaths > maximums.deaths) {
				maximums.deaths = data.deaths;
			}
		};

		// Process the data for each country, region, and city in the nightmare of
		// nested loops.
		for(var d in data) {
			if(data.hasOwnProperty(d)) {
				var date = data[d];

				for(var c in date) {
					if(date.hasOwnProperty(c)) {
						var country = date[c];

						for(var r in country) {
							if(country.hasOwnProperty(r)) {
								var region = country[r];

								for(var city in region) {
									if(region.hasOwnProperty(city)) {
										var point = region[city];

										// Check and see if this is the country level data
										if(r == 'ZZ' && city.toLowerCase() == 'unknown') {
											putData(c, 'country', d, point);
										}
									}
								}
							}
						}
					}
				}
			}
		}

		var arrayData = [];

		// Now, convert the object to an array so that D3 can use it, and pre-lookup the 
		// latitudes and longitudes to avoid during during each render cycle.
		for(var i in processedData) {
			if(processedData.hasOwnProperty(i)) {
				var code = i.split('.');
				var coordinates = locator.locate(code[0], code.length >= 2 ? code[1] : null, code.length == 3 ? code[2] : null);

				arrayData.push({
					code: i,
					type: processedData[i].type,
					data: processedData[i].data,
					coordinates: coordinates
				});
			}
		}

		return arrayData;
	};

	/**
	 * Plot all of the points on the map and project them from their
	 * latitude and longitude
	 * @param  {object} data Data to plot
	 */
	Map.prototype.plotPoints = function(data) {
		var self = this;

		this.el.selectAll('circle')
			.attr('transform', function(d) {
				if(d.coordinates == null) {
					return 'translate(-1000, -1000)';
				}

				var c = self.projection([d.coordinates.longitude, d.coordinates.latitude]);
				if(isNaN(c[0]) || isNaN(c[1])) {
					return null;
				}
				
				return 'translate(' + c + ')';
			})
	};

	/**
	 * Set the current date of the map
	 */
	Map.prototype.setDate = function(date) {
		currentDate = date;

		this.redraw();
	};

	return Map;
})