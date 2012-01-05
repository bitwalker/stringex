var vows  	= require('vows'),
    assert	= require('assert');

var unidecoder = require('../lib/unidecoder');

var string = "$2 Sodas";

vows.describe('Utility Functions').addBatch({

	'when decoding utf-8 to ascii': {
		topic: function() { return unidecoder.decode(string); },

		'stuff happens': function(topic) {
			assert.equals(topic, string);
		}
	}

}).export(module);