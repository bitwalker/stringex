var vows       = require('vows'),
    assert     = require('assert'),
    Unidecoder = require('../lib/unidecoder');

var encoded = "Today it was -140° outside!";
var decoded = "Today it was -140deg outside!";

var scandicEncoded = "älä lyö ääliö ööliä läikkyy";
var scandicDecoded = "ala lyo aalio oolia laikkyy";

var cyrillicEncoded = "Контакты";
var cyrillicDecoded = "Kontakty";

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
  }

}).export(module);
