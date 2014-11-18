'use strict';

define(['require', 'zepto', 'underscore', 'moment', 'd3', 'd3tip', 'topojson', 'easing', '../data/Locator'], function(require, $, _, moment, d3, d3tip, topojson, easing, Locator) {
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
	 * Minimum size of a point in pixels
	 * @type {Number}
	 */
	var minPointSize = 4;

	/**
	 * Maximum size of a point in pixels
	 * @type {Number}
	 */
	var maxPointSize = 18;

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

		this.setLevel(this.scale);

		this.projection.scale(this.scaleExtent[0]);

		this.path = d3.geo.path()
			.projection(this.projection);

		// Setup the tooltips
		var self = this;
		this.tips = d3tip()
			.attr('class', 'd3-tip')
			.html(function(d) {
				var processedData = self._dataForCurrentTime.call(self, d);

				return '<div>'
					+ '<div class="region-name">' + '</div>'
					+ '<div class="cases-count">' + processedData.cases + ' cases</div>'
					+ '<div class="deaths-count">' + processedData.deaths + ' deaths</div>'
				+ '</div>';
			});

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
		if (d3.event && d3.event.translate && d3.event.scale) { 
			var scale = d3.event.scale,
			t = d3.event.translate;

			// if scaling changes, ignore translation (otherwise touch zooms are weird)
			if (scale != this.lastScale) {
				this.projection.scale(scale);
				this.setLevel(scale);
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
	 * Set the map level according to the specified zoom scale
	 */
	Map.prototype.setLevel = function(zoomScale) {
		var level = 1;
		if(zoomScale > 400) {
			level = 3;
		} else if(zoomScale > 200) {
			level = 2;
		}

		$('#map-container')
			.removeClass('level-1')
			.removeClass('level-2')
			.removeClass('level-3')
			.addClass('level-' + level);
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
				$('main').addClass('loaded');
			});
		});
	};

	/**
	 * Initialize the points on the map from the specified dataset
	 * @param  {object} data Data to plot
	 */
	Map.prototype.initPoints = function(data) {
		var arrayData = this.processPoints(data);

		// Initialize the tooltips
		this.el.call(this.tips);

		this.el.selectAll('circle')
			.data(arrayData)
			.enter()
				.append('circle')
					.on('mouseover', this.tips.show)
					.on('mouseout', this.tips.hide)
					.attr('r', 5)
					.attr('class', function(d) {
						return 'ping' +
							' ping-' + d.code.replace(/\./g, '-').replace(/\s+/g, '-') +
							' ping-level-' + d.code.split('.').length +
							' ' + d.class
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

		// Object containing the most specific data type for each country, which is
		// used to determine which data to show or hide at different zoom levels
		var levelData = {};

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

			var country = code.split('.')[0];
			if(!levelData.hasOwnProperty(country)) {
				levelData[country] = [];
			}

			if(levelData[country][type] == null) {
				levelData[country][type] = true;
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

										// Check what level data this is an properly
										// put it into the processed data.
										if(r == 'ZZ' && city.toLowerCase() == 'unknown') {
											putData(c, 1, d, point);
										} else if(r != 'ZZ' && city.toLowerCase() == 'unknown') {
											putData([c, r].join('.'), 2, d, point);
										} else {
											putData([c, r, city].join('.'), 3, d, point);
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

				var mostSpecificData = levelData[code[0]];
				var c = [];
				var inGap = false;

				for(var l = 1; l < mostSpecificData.length; l++) {
					if(mostSpecificData[l] === true) {
						inGap = false;
					}

					if(l == processedData[i].type) {
						inGap = true;
					}					

					if(!inGap) {
						c.push('hide-level-' + l);
					}
				}

				arrayData.push({
					code: i,
					type: processedData[i].type,
					class: c.join(' '),
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
				return 'translate(' + c + ')';
			})
			.transition()
			.attr('r', function(d) {
				var processedData = self._dataForCurrentTime.call(self, d);
				if(processedData == null) {
					return 0;
				}

				var p = processedData.cases / (maximums.cases - minimums.cases);

				if(isNaN(processedData.cases) || processedData.cases == null) {
					return 0;
				}

				if(processedData.cases == 0) {
					return 0;
				}

				return easing.easeOutQuart(p) * (maxPointSize - minPointSize) + minPointSize;
			})
			.attr('fill', function(d) {
				var processedData = self._dataForCurrentTime.call(self, d);
				if(processedData == null) {
					return 'transparent';
				}

				var deathRate = Math.max(0, Math.min(1, processedData.deaths / processedData.cases));

				return d3.hsl(55 - (deathRate * 55), 1, 0.5).toString();
			});
	};

	/**
	 * Get the data point for the current time from the dataset
	 * @param  {object} d Dataset including all times
	 * @return {object}   New dataset with the data property set to
	 *                    the datapoint at the current date.
	 */
	Map.prototype._dataForCurrentTime = function(d) {
		return (_.memoize(this._dataForTime.bind(this)))(d, currentDate);
	};

	/**
	 * Retrieve the data for the specified date
	 * @param  {object} d    Data to pull date specific data for
	 * @param  {moment} date Date to retrieve data for
	 * @return {object}      New dataset with data set to the current date
	 */
	Map.prototype._dataForTime = function(d, date) {
		var checkpoint = null;

		var cases = 0;
		var deaths = 0;

		for(var i in d.data) {
			if(d.data.hasOwnProperty(i)) {
				if(d.data[i].moment == null) {
					d.data[i].moment = moment(i);
				}

				var point = d.data[i];

				if(date.diff(d.data[i].moment) >= 0) {
					if(d.data[i].cases) {
						cases = d.data[i].cases;
					}

					if(d.data[i].deaths) {
						deaths = d.data[i].deaths;
					}
				}

				if(cases != 0 && deaths != 0) {
					break;
				}
			}
		}

		return {
			cases: cases,
			deaths: deaths
		};
	};

	/**
	 * Set the current date of the map
	 */
	Map.prototype.setDate = function(date) {
		currentDate = date;
	};

	return Map;
})