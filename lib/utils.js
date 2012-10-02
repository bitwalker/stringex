// Utility functionality borrowed from Underscore.js
(function() {

  // Safely wrap utils object
  var utils = function(obj) { return new wrapper(obj); };

  module.exports = utils;

  // ForEach implementation using native forEach where available
  var each = utils.each = utils.forEach = function forEach(obj, iterator, context) {
    if (obj === null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Easily add new functions to utils as well as the wrapper object
  utils.mixin = function mixin(obj) {
    each(utils.functions(obj), function(name) {
        addToWrapper(name, utils[name] = obj[name]);
    });
  };

  // Return all functions/methods of an object
  utils.functions = utils.methods = function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (utils.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Determine if an object is a function
  utils.isFunction = function isFunction(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]';
  };

  // Delegate chaining to wrapper
  utils.chain = function(obj) {
    return utils(obj).chain();
  };



  // If utils called as function, return wrapped object
  var wrapper = function wrapper(obj) { this._wrapped = obj; };
  // Start chaining a wrapped utils object
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extract the result from a wrapped and chained object
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

  // Expose utils.prototype as wrapper.prototype
  utils.prototype = wrapper.prototype;

  // Helper to continue chaining intermediate results
  var result = function result(obj, chain) {
    return chain ? utils(obj).chain() : obj;
  };

  // Method to easily add functions to wrapper
  var addToWrapper = function addToWrapper(name, func) {
    wrapper.prototype[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.call(args, this._wrapped);
      return result(func.apply(utils, args), this._chain);
    };
  };

  // Add utils functions to wrapper
  utils.chain(utils);

}).call(this);
