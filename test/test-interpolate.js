var assert      = require('chai').assert,
    stringex    = require('../lib/stringex'),
    interpolate = require('../lib/interpolate');

describe('String Interpolation', () => {

  context('when interpolating a string with a single string parameter', () => {
    let topic = interpolate('Hello #{0}!', 'Paul');

    it('the string returned will be the source interpolated with the provided parameter', () => {
      assert.equal(topic, 'Hello Paul!');
    })
  })

  context('when interpolating a string with more parameters than variables', () => {
    let topic = interpolate('Hello #{0}, #{1}.', 'Paul', 'Nice to meet you', 'See you later!');

    it('the extra parameters are ignored', () => {
      assert.equal(topic, 'Hello Paul, Nice to meet you.');
    })
  })

  context('when interpolating a string with fewer parameters than variables', () => {
    let topic = interpolate('The result of #{0} / 1 is #{1}', 2);

    it('the remaining variables are interpolated with the last parameter', () => {
      assert.equal(topic, 'The result of 2 / 1 is 2');
    })
  })

  context('when interpolating a string with fewer params than variables, but with an object parameter provided', () => {
    let topic = interpolate('My name is #{name}. My email is #{email}', {
      name: 'Paul',
      email: 'paulschoenfelder@gmail.com'
    });

    it('the keys of the object will be used to do named replacements in the string', () => {
      assert.equal(topic, 'My name is Paul. My email is paulschoenfelder@gmail.com');
    })
  })

  context('when interpolating with a regular expression object', () => {
    let topic = interpolate(/^#{0}$/g, 'Testing');

    it('the result is a RegExp object instead of a string', () => {
      assert.ok(topic.constructor === RegExp);
      assert.equal(topic.toString(), '/^Testing$/g');
    })
  })

  context('when interpolating in mixed-mode (named and numbered params)', () => {
    let topic = interpolate('My #{0} is #{name}. My #{1} is #{email}', 'name', 'email', {
      name: 'Paul',
      email: 'paulschoenfelder@gmail.com'
    });

    it('the interpolation will replace named variables from the object param, and numbered params in their provided order', () => {
      assert.equal(topic, 'My name is Paul. My email is paulschoenfelder@gmail.com');
    })

    it('the interpolation still works if the object param comes first', () => {
      assert.equal(interpolate('My #{0} is #{name}', {
        name: 'Paul'
      }, 'name'), 'My name is Paul');
    })
  })

})
