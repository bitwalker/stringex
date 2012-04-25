var vows       = require('vows'),
    assert     = require('assert'),
    Unidecoder = require('../lib/unidecoder');

var encoded = "Today it was -140° outside!";
var decoded = "Today it was -140deg outside!";

var scandicEncoded = "älä lyö ääliö ööliä läikkyy";
var scandicDecoded = "ala lyo aalio oolia laikkyy";

var cyrillicEncoded = "Контакты";
var cyrillicDecoded = "Kontakty";

var arabicEncoded = "لعربي";
var arabicDecoded = "l`rb";

var hebrewEncoded = "עִבְרִית";
var hebrewDecoded = "`ib@rit";

var turkishEncoded = "İstanbul";
var turkishDecoded = "Istanbul";

var georgianEncoded = "საქართველო";
var georgianDecoded = "sak`art`velo";

vows.describe('Unidecoder').addBatch({

  'when decoding "Today it was -140° outside!" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(encoded); },

    'the result should be "Today it was -140deg outside!"': function(topic) {
      assert.equal(topic, decoded);
    }
  },

  'when decoding "älä lyö ääliö ööliä läikkyy" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(scandicEncoded); },
    'the result should be "ala lyo aalio oolia laikkyy"': function(topic) {
      assert.equal(topic, scandicDecoded);
    }
  },

  'when decoding "Контакты" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(cyrillicEncoded); },
    'the result should be "Kontakty"': function(topic) {
      assert.equal(topic, cyrillicDecoded);
    }
  },

  'when decoding "العربي" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(arabicEncoded); },
    'the result should be "l`rb"': function(topic) {
      assert.equal(topic, arabicDecoded);
    }
  },

  'when decoding "עִבְרִית" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(hebrewEncoded); },
    'the result should be "`ib@rit"': function(topic) {
      assert.equal(topic, hebrewDecoded);
    }
  },

  'when decoding "İstanbul" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(turkishEncoded); },
    'the result should be "Istanbul"': function(topic) {
      assert.equal(topic, turkishDecoded);
    }
  },

  'when decoding "საქართველო" from unicode to ASCII': {
    topic: function() { return Unidecoder.decode(georgianEncoded); },
    'the result should be "sak`art`velo"': function(topic) {
      assert.equal(topic, georgianDecoded);
    }
  }

}).export(module);
