var assert = require('chai').assert,
    stringex = require('../lib/stringex');
    utils  = require('../lib/utils');

const string = "$2 Soda   ";

describe('Utility Functions', () => {

  context('when chaining an object', () => {

    it('the original is not modified', () => {
      const string = "$2 Soda   ";
      let s = utils.chain(string);
      assert.isTrue(s.convertMiscCharacters().value() != string);
    })

    it('the wrapped object is passed as the first parameter to chained functions', () => {
      const string = "$2 Soda   ";
      let s = utils.chain(string);
      assert.equal(s.squeeze().value(), '$2 Soda ');
    })
  })

})
