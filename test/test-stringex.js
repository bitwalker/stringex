var assert   = require('chai').assert,
    StringEx = require('../lib/stringex');

describe('String Extensions', () => {
  context('when converting the string "$2 Soda" to a url-friendly format', () => {
    let topic = StringEx.toUrl('$2 Soda');

    it('we get 2-dollars-soda as a result', () => {
      assert.equal(topic, '2-dollars-soda');
    })
  })

  context('when stripping html tags from "<p>Hello!</p>"', () => {
    let topic = StringEx.stripHtmlTags("<p>Hello!</p>");

    it('we get "Hello!" as a result', () => {
      assert.equal(topic, 'Hello!');
    })
  })

  context('when squeezing the string "yellow moon"', () => {
    let topic = StringEx.squeeze('yellow moon');

    it('we get "yelow mon" as a result', () => {
      assert.equal(topic, 'yelow mon');
    })
  })

  context('when squeezing the string "  now    is  the", with " " as a parameter', () => {
    let topic = StringEx.squeeze('  now    is  the', ' ');

    it('we get " now is the" as a result', () => {
      assert.equal(topic, ' now is the');
    })
  })

  context('when squeezing the string "putters shoot balls" with "m-z" as a parameter', () => {
    let topic = StringEx.squeeze('putters shoot balls', 'm-z');

    it('we get "puters shot balls" as a result', () => {
      assert.equal(topic, 'puters shot balls');
    })
  })

  context('when calling interpolate with a string and arguments', () => {
    let topic = StringEx.interpolate('Hello #{0}!', 'Paul');

    it('it returns the expected result', () => {
      assert.equal(topic, 'Hello Paul!');
    })
  })

  context('when calling randomChars without a limit', () => {
    let topic = StringEx.randomChars();

    it('it returns a 32 character string of random alphanumeric characters', () => {
      assert.ok(/^[\w\d]{32}$/g.test(topic));
      assert.ok(topic.length === 32);
    })
  })

  context('when calling randomChars with a limit of 8', () => {
    let topic = StringEx.randomChars(8);

    it('it returns an 8 character string of random alphanumeric characters', () => {
      assert.ok(/^[\w\d]{8}$/g.test(topic));
      assert.ok(topic.length === 8);
    })
  })
})
