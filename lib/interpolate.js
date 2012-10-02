var interpolate = module.exports = function(string) {
  /*jshint regexdash:false */

  if ((typeof string === 'object' && string.constructor === RegExp) || typeof string === 'string') {

    // Convert arguments to array
    var args = [].slice.apply(arguments);
    // If this function was called with an array of parameters instead of individual parameters
    // then we need to use that array as our arguments array instead of the arguments object
    if (args.length === 2 && typeof args[1] === 'object' && args[1].constructor === Array) {
      args = args[1];
    }
    // The string to be interpolated
    var interpolated;
    // The pattern to match for interpolation variables
    var interpolationPattern = /#\{[\d]+\}|#\{[\w-_]+\}/g;
    // An array of strings that were split by matching on the interpolation pattern
    var matches = [];

    // Regular expression parts to be reassembled later
    var flags;
    var regex;

    if ((typeof string === 'object' && string.constructor === RegExp)) {
      // Remove string parameter from arguments
      args.shift();

      // Get the array of matches for flags, and use
      // shift to remove the pattern match element
      flags = /.+\/([gim]+)?$/.exec(string.toString());
      flags.shift();
      // Get the raw pattern without the js jive
      regex = /^\/(.+)\/[gim]+?$/.exec(string.toString());
      regex.shift();

      // We're assuming that to reach this point, this is a valid regexp,
      // so regex will always contain one element, which is the raw pattern
      interpolated = regex[0];

    } else {

      // Remove string parameter from arguments and use it as our interpolation target
      interpolated = args.shift();

    }

    if (args.length) {

      // For every argument passed in, find the interpolation variable with
      // the same index value (minus one to account for the string var istelf).
      // So: interpolate("Hello, #{0}. #{1}", 'Paul', "It's nice to meet you.") will
      // render "Hello, Paul. It's nice to meet you."

      matches = interpolated.split(interpolationPattern);

      if ((matches.length - 1) === (args.length)) {
        // There was an argument supplied for all interpolations

        interpolated = doReplace(interpolated, args);

      } else if ((matches.length - 1) < (args.length)) {
        // There were more arguments supplied than interpolations

        interpolated = doReplace(interpolated, args);

      } else if ((matches.length - 1) > (args.length)) {
        // There were fewer arguments supplied than interpolations
        var memo = args[args.length - 1];

        // Replace the provided arguments
        interpolated = doReplace(interpolated, args);

        // Replace remaining interpolations with the last provided argument value
        interpolated = doReplaceAll(interpolated, memo);

      }

    }

    if (typeof string === 'object' && string.constructor === RegExp) {
      return flags ? new RegExp(interpolated, flags) : new RegExp(interpolated);
    } else {
      return interpolated;
    }
  }
  else {
    throw new Error('Invalid type passed as interpolation target. Must be string or RegExp.');
  }

  // Iterate through the arguments, peforming either an indexed or named interpolation depending on param type
  function doReplace(target, arr) {
    var pattern;
    var index = 0;

    do {

      var arg = arr.shift();

      if (typeof arg === 'object') {
        for (var key in arg) {
          pattern = new RegExp('#\\{' + key + '\\}', 'g');
          target = target.replace(pattern, arg[key]);
        }

      } else {
        pattern = new RegExp('#\\{' + index + '\\}', 'g');
        target = target.replace(pattern, arg.toString());
        index++;
      }

    } while (arr.length);

    return target;
  }

  // Replace all instances of #{[\d]+}
  function doReplaceAll(target, replace) {
    target = target.replace(interpolationPattern, replace.toString());

    return target;
  }

};
