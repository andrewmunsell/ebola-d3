'use strict';

define(['require'], function(require) {
	/**
	 * Constructor for the Collector, which aggregates the different data collectors
	 * into a single data set that can be presented.
	 *
	 * Data is formatted as follows:
	 *
	 * {
	 * 		"2014-10-21T21:44:00Z": {
	 * 			"US": {
	 * 				"TX": {
	 * 					"cases": 3,
	 * 					"deaths": 1	
	 * 				}
	 * 			}
	 * 		}
	 * }
	 *
	 * Each time set is identified by its ISO date time stamp. Underneath each time is an ISO 3166-1 
	 * country code, which contains an 2-letter region code if available. If no region is available
	 * or known, the identifier "ZZ" is used instead. Inside of the region data is the city level data.
	 * Unknown cities are simply identified as "Unknown". Unknown countries are not represented in the 
	 * data set.
	 */
	var Collector = function() {

	};

	return Collector;
});