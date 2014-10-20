'use strict';

define(['require', 'd3', 'topojson'], function(require, d3, topojson) {
	var dataFile = 'data/world-110m.json';

	var maxLatitude = 83;

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

		this.el.selectAll('path')       // re-project path data
			.attr('d', this.path);
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
	};

	return Map;
})