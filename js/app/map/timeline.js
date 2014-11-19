'use strict';

define(['require', 'eventEmitter', 'd3', 'd3textwrap', 'zepto', 'moment'], function(require, EventEmitter, d3, d3textwrap, zepto, moment) {
	/**
	 * URL for the file containing the events to plot on the map
	 * @type {String}
	 */
	var eventsUrl = './data/events.json';

	/**
	 * Constructor for the timeline that accepts the element to use
	 */
	var Timeline = function(el, width, height) {
		this.el = el;
		this.width = width;
		this.height = height;

		this.playIntervalId = null;

		this.calculateTimelineBounds();

		this.start = moment('2014-03-01');
		this.end = moment('2014-11-18');

		this.currentDate = moment('2014-03-01');

		this.currentMarkerPosition = this.minimumCurrentMarkerPosition;

		this.eventData = [];

		this.emitter = new EventEmitter();
	};

	/**
	 * Set the width of the timeline
	 * @param {number} width
	 */
	Timeline.prototype.setWidth = function(width) {
		this.width = width;

		this.redraw();
	};

	/**
	 * Calculate and set the beginning and ending timeline boundaries
	 */
	Timeline.prototype.calculateTimelineBounds = function() {
		this.minimumCurrentMarkerPosition = this.width * 0.15 + this.height / 2;
		this.maximumCurrentMarkerPosition = this.width - (this.width * 0.15 + this.height / 2);
	};

	/**
	 * Add an event at the specified time with the specified name and data
	 */
	Timeline.prototype.addEvent = function(time, data) {
		if(data.name.length > 18) {
			console.log('You may want to shorten the event name.');
		}

		this.eventData.push({
			time: time,
			data: data
		});
	};

	/**
	 * Resize the timeline based on the current width and height
	 */
	Timeline.prototype.redraw = function() {
		var self = this;

		this.calculateTimelineBounds();

		var p = (this.currentDate.diff(this.start)) / (this.end.diff(this.start));
		this.currentMarkerPosition = this.minimumCurrentMarkerPosition + 
			p * (this.maximumCurrentMarkerPosition - this.minimumCurrentMarkerPosition);

		/**
		 * Backdrop
		 */
		this.backdrop
			.attr('x', this.width * 0.15)
			.attr('y', 0)
			.attr('width', this.width * 0.7)
			.attr('height', this.height)
			.attr('rx', this.height / 2)
			.attr('ry', this.height / 2);

		/**
		 * Current Time Marker
		 */
		this.currentMarker
			.attr('cx', this.currentMarkerPosition)
			.attr('cy', this.height / 2)
			.attr('r', 8)
			.attr('class', 'timeline-current-time');

		this.currentDateMarker
			.text(this.currentDate.format('MMM Do, YYYY'));

		this.drawDate();

		/**
		 * Event Markers
		 */
		 this.drawEventMarkers();

		 /**
		  * Draw the play/pause button
		  */
		 this.drawPlayPause();
	};

	/**
	 * Draw the current date marker
	 */
	Timeline.prototype.drawDate = function() {
		this.currentDateMarker
			.attr('x', this.currentMarkerPosition)
			.attr('y', -24);
	};

	/**
	 * Draw the timeline event markers
	 */
	Timeline.prototype.drawEventMarkers = function() {
		var self = this;

		var eventMarker = this.eventContainer
			.selectAll('svg')
				.data(this.eventData)
				.enter()
					.append('svg')
						.attr('x', function(d) {
							var ratio = (d.time.unix() - self.start.unix()) / (self.end.unix() - self.start.unix());

							return (100 * (0.15 + 0.7 * ratio)) + '%';
						})
						.attr('class', 'timeline-event');

		/**
		 * Add lines, text, and summary
		 */
		
		var lineLength = 200;
		var summaryWidth = 300;

		var lineGroup = eventMarker.append('g')
			.attr('class', 'timeline-event-line-container');
		
		lineGroup
			.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', lineLength)
				.attr('y2', 0)
				.attr('stroke-width', 1)
				.attr('class', 'timeline-event-line');
		
		lineGroup
			.append('text')
				.attr('x', lineLength)
				.attr('y', -3)
				.attr('text-anchor', 'end')
				.attr('class', 'timeline-event-name')
				.text(function(d) {
					return d.data.name;
				});

		var summaryGroup = eventMarker.append('g')
			.attr('transform', function(d) {
				var coords = (Math.sqrt(Math.pow(lineLength, 2) / 2));
				return 'translate(' + coords + ' ' + coords + ')';
			})
			.attr('class', 'timeline-event-summary');

		summaryGroup
			.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', summaryWidth / 4)
				.attr('y2', 0)
				.attr('class', 'timeline-event-summary-line');

		summaryGroup
			.append('g')
				.attr('class', 'timeline-event-summary-value-group')
					.append('text')
						.attr('class', 'timeline-event-summary-value')
						.text(function(d) {
							return d.data.description;
						});

		setTimeout(function() {
			try {
				d3.select('text.timeline-event-summary-value')
					.textwrap({
						x: 0,
						y: 4,
						width: summaryWidth,
						height: 400
					});
			} catch(e) { }
		}, 250);

		/**
		 * Add actual marker
		 */
		eventMarker
			.append('circle')
				.attr('cx', 0)
				.attr('cy', this.height / 2)
				.attr('r', 24)
				.attr('class', 'timeline-event-outer');

		eventMarker
			.append('circle')
				.attr('cx', 0)
				.attr('cy', this.height / 2)
				.attr('r', 20)
				.attr('class', 'timeline-event-inner');
	};

	/**
	 * Draw the play/pause button
	 */
	Timeline.prototype.drawPlayPause = function() {
		this.playButton
			.attr('x', this.width * 0.15 - 8)
			.attr('y', this.height / 2);

		if(this.playIntervalId != null) {
			this.playButton
				.text('Pause');
		} else {
			this.playButton
				.text('Play');
		}
	};

	/**
	 * Load the timeline
	 */
	Timeline.prototype.load = function() {
		var self = this;

		this.container = this.el.append('g');

		this.backdrop = this.container
			.append('rect')
				.attr('class', 'timeline-backdrop');

		this.currentDateMarker = this.container
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('class', 'timeline-current-date-text');

		this.eventContainer = this.container
			.append('g')
				.attr('class', 'timeline-events');

		this.currentMarker = this.container
			.append('circle');

		this.playButton = this.container
			.append('text')
				.attr('class', 'play-pause')
				.text('Play')
				.on('click', function() {
					self.togglePlay.call(self);
				});

		this.redraw();

		this.currentMarker.call(this.initDrag());
		this.setDate(this.currentDate);

		this.loadEvents();
	};

	/**
	 * Load events from the JSON file
	 */
	Timeline.prototype.loadEvents = function() {
		var self = this;

		d3.json(eventsUrl, function(err, json) {
			for(var i = 0; i < json.length; i++) {
				self.addEvent(moment(json[i].date), json[i].data);
			}

			self.redraw.call(self);
		});
	};

	/**
	 * Initialize the drag behavior of the timeline
	 */
	Timeline.prototype.initDrag = function() {
		var self = this;

		return d3.behavior.drag()
			.on('drag', function(d) {
				var markerPosition = d3.event.x;
				if(markerPosition < self.minimumCurrentMarkerPosition) {
					markerPosition = self.minimumCurrentMarkerPosition;
				} else if(markerPosition > self.maximumCurrentMarkerPosition) {
					markerPosition = self.maximumCurrentMarkerPosition;
				}

				var p = (markerPosition - self.minimumCurrentMarkerPosition) / (self.maximumCurrentMarkerPosition - self.minimumCurrentMarkerPosition);
				var pDiff = self.end.diff(self.start) * p;

				self.setDate.call(self, moment(self.start).add(pDiff, 'milliseconds'));

				self.redraw.call(self);
			})
			.on('dragstart', function(d) {
				self.currentDateMarker
					.attr('class', 'timeline-current-date-text dragging');
			})
			.on('dragend', function(d) {
				self.currentDateMarker
					.attr('class', 'timeline-current-date-text');
			});
	};

	/**
	 * Toggle the play state
	 */
	Timeline.prototype.togglePlay = function() {
		if(this.playIntervalId == null) {
			this.play();
		} else {
			this.pause();
		}
	};

	/**
	 * Play the timeline animation
	 */
	Timeline.prototype.play = function() {
		var self = this;

		this.playIntervalId = setInterval(function() {
			self._tick.call(self);
		}, 1000);

		this.redraw();
	};

	/**
	 * Pause the auto-play animation
	 */
	Timeline.prototype.pause = function() {
		this.currentDateMarker
					.attr('class', 'timeline-current-date-text');

		clearTimeout(this.playIntervalId);

		this.playIntervalId = null;

		this.redraw();
	};

	/**
	 * Perform an animation tick forward in time
	 */
	Timeline.prototype._tick = function() {
		var tomorrow = moment(this.currentDate).add(1, 'day');

		if(tomorrow.isAfter(this.end)) {
			this.pause();
		} else {
			this.currentDateMarker
					.attr('class', 'timeline-current-date-text dragging');

			this.setDate(tomorrow);
			this.redraw();
		}
	};

	/**
	 * Set the current date
	 * @param {moment} date
	 */
	Timeline.prototype.setDate = function(date) {
		this.currentDate = date;

		this.emitter.emitEvent('dateChanged', [date]);
	};

	return Timeline;
});