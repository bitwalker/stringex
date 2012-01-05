var vows 		= require('vows'),
		assert 	= require('assert');

var stringex = require('../lib/stringex');

vows.describe('String Extensions').addBatch({
	'when converting the string "$2 Soda" to a url-friendly format': {
		topic: function() { return stringex.toUrl('$2 Soda'); },

		'we get 2-dollars-soda as a result': function(topic) {
			assert.equal(topic, '2-dollars-soda');
		}
	},

	'when stripping html tags from "<p>Hello!</p>"': {
		topic: function() { return stringex.stripHtmlTags("<p>Hello!</p>"); },

		'we get "Hello!" as a result': function(topic) {
			assert.equal(topic, 'Hello!');
		}
	},

	'when squeezing the string "yellow moon"': {
		topic: function() { return stringex.squeeze('yellow moon'); },

		'we get "yelow mon" as a result': function(topic) {
			assert.equal(topic, 'yelow mon');
		}
	},

	'when squeezing the string "  now    is  the", with " " as a parameter': {
		topic: function() { return stringex.squeeze('  now    is  the', ' '); },

		'we get " now is the" as a result': function(topic) {
			assert.equal(topic, ' now is the');
		}
	},

	'when squeezing the string "putters shoot balls" with "m-z" as a parameter': {
		topic: function() { return stringex.squeeze('putters shoot balls', 'm-z'); },

		'we get "puters shot balls" as a result': function(topic) {
			assert.equal(topic, 'puters shot balls');
		}
	}
}).export(module);