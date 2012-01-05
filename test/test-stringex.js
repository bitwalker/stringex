var vows 		= require('vows'),
		assert 	= require('assert');

var stringex = require('../lib/stringex');

vows.describe('String Extensions').addBatch({
	'when converting the string "$2 Soda" to a url-friendly format': {
		topic: function() { return stringex.toUrl('$2 Soda'); },

		'we get two-dollar-soda as a result': function(topic) {
			assert.equal(topic, 'two-dollar-soda');
		}
	}
}).run();