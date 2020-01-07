var assert     = require('chai').assert,
    Unidecoder = require('../lib/unidecoder');

var encoded = 'Today it was -140° outside!';
var decoded = 'Today it was -140deg outside!';

var scandicEncoded = 'älä lyö ääliö ööliä läikkyy';
var scandicDecoded = 'ala lyo aalio oolia laikkyy';

var cyrillicEncoded = 'Контакты';
var cyrillicDecoded = 'Kontakty';

var arabicEncoded = 'لعربي';
var arabicDecoded = 'l`rby';

var hebrewEncoded = 'עברית';
var hebrewDecoded = 'pgshk[?]';

var turkishEncoded = 'İstanbul';
var turkishDecoded = 'Istanbul';

var georgianEncoded = 'საქართველო';
var georgianDecoded = 'sak`art`velo';

var hiraganaEncoded = 'ひらがな';
var hiraganaDecoded = 'hiragana';

var hangulEncoded = '해동검도';
var hangulDecoded = 'haedonggeomdo';

describe('Unidecoder', () => {

  context('when decoding "Today it was -140° outside!" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(encoded);

    it('the result should be "Today it was -140deg outside!"', () => {
      assert.equal(topic, decoded);
    })
  })

  context('when decoding "' + scandicEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(scandicEncoded);
    it('the result should be "' + scandicDecoded + '"', () => {
      assert.equal(topic, scandicDecoded);
    })
  })

  context('when decoding "' + cyrillicEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(cyrillicEncoded);
    it('the result should be "' + cyrillicDecoded + '"', () => {
      assert.equal(topic, cyrillicDecoded);
    })
  })

  context('when decoding "' + arabicEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(arabicEncoded);
    it('the result should be "' + arabicDecoded + '"', () => {
      assert.equal(topic, arabicDecoded);
    })
  })

  context('when decoding "' + hebrewEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(hebrewEncoded);
    it('the result should be "' + hebrewDecoded + '"', () => {
      assert.equal(topic, hebrewDecoded);
    })
  })

  context('when decoding "' + turkishEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(turkishEncoded);
    it('the result should be "' + turkishDecoded + '"', () => {
      assert.equal(topic, turkishDecoded);
    })
  })

  context('when decoding "' + georgianEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(georgianEncoded);
    it('the result should be "' + georgianDecoded + '"', () => {
      assert.equal(topic, georgianDecoded);
    })
  })

  context('when decoding "' + hiraganaEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(hiraganaEncoded);
    it('the result should be "' + hiraganaDecoded + '"', () => {
      assert.equal(topic, hiraganaDecoded);
    })
  })

  context('when decoding "' + hangulEncoded + '" from unicode to ASCII', () => {
    let topic = Unidecoder.decode(hangulEncoded);
    it('the result should be "' + hangulDecoded + '"', () => {
      assert.equal(topic, hangulDecoded);
    })
  })

})
