var vows     = require('vows'),
    assert   = require('assert'),
    StringEx = require('../lib/stringex');

vows.describe('String Extensions').addBatch({
  'when converting the string "$2 Soda" to a url-friendly format': {
    topic: function() { return StringEx.toUrl('$2 Soda'); },

    'we get 2-dollars-soda as a result': function(topic) {
      assert.equal(topic, '2-dollars-soda');
    }
  },

  'when stripping html tags from "<p>Hello!</p>"': {
    topic: function() { return StringEx.stripHtmlTags("<p>Hello!</p>"); },

    'we get "Hello!" as a result': function(topic) {
      assert.equal(topic, 'Hello!');
    }
  },

  'when squeezing the string "yellow moon"': {
    topic: function() { return StringEx.squeeze('yellow moon'); },

    'we get "yelow mon" as a result': function(topic) {
      assert.equal(topic, 'yelow mon');
    }
  },

  'when squeezing the string "  now    is  the", with " " as a parameter': {
    topic: function() { return StringEx.squeeze('  now    is  the', ' '); },

    'we get " now is the" as a result': function(topic) {
      assert.equal(topic, ' now is the');
    }
  },

  'when squeezing the string "putters shoot balls" with "m-z" as a parameter': {
    topic: function() { return StringEx.squeeze('putters shoot balls', 'm-z'); },

    'we get "puters shot balls" as a result': function(topic) {
      assert.equal(topic, 'puters shot balls');
    }
  },

  'when calling interpolate with a string and arguments': {
    topic: function() { return StringEx.interpolate('Hello #{0}!', 'Paul'); },

    'it returns the expected result': function(topic) {
      assert.equal(topic, 'Hello Paul!');
    }
  }
}).export(module);