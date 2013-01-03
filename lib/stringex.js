/*jshint regexdash:true */
var utils        = require('./utils'),
    Unidecoder   = require('./unidecoder'),
    interpolater = require('./interpolate');

var StringEx = function() {};

// Create a URI-friendly representation of the string
StringEx.prototype.toUrl = function toUrl(string) {
  return utils.chain(string.toLowerCase())
              .removeFormatting()
              .replaceWhitespace('-')
              .collapse('-')
              .value();
};

// Performs multiple text manipulations. Essentially a shortcut
// for typing them all. View source below to see which methods are run.
StringEx.prototype.removeFormatting = function removeFormatting(string) {
  return utils.chain(string)
              .stripHtmlTags()
              .convertAccentedEntities()
              .convertMiscEntities()
              .convertMiscCharacters()
              .collapse()
              .value();
};

// Removes HTML tags from text.
StringEx.prototype.stripHtmlTags = function stripHtmlTags(string, leaveWhitespace) {
  leaveWhitespace = typeof(leaveWhitespace) != 'undefined' ? leaveWhitespace : false;

  var rx = /<[!\/?\[]?([\w:_-]+|--)(\s+(([\w:_-]+(\s*=\s*([A-Za-z0-9]+|('[^']*?'|"[^"]*?")))?)(\s+([\w:_-]+(\s*=\s*([A-Za-z0-9]+|('[^']*?'|"[^"]*?")))?))*))?\s*([!\/?\]]+|--)?>/g;
  var leadingOrTrailingWhitespace = /^\s+|\s+$/g;
  var whitespace = /\s+/g;

  if (leaveWhitespace)
    return string.replace(rx, '').replace(leadingOrTrailingWhitespace, '');
  else
    return string.replace(rx, '').replace(whitespace, ' ').replace(leadingOrTrailingWhitespace, '');
};

/* Converts HTML entities into the respective non-accented letters. Examples:
 *
 *   "&aacute;".convert_accented_entities # => "a"
 *   "&ccedil;".convert_accented_entities # => "c"
 *   "&egrave;".convert_accented_entities # => "e"
 *   "&icirc;".convert_accented_entities # => "i"
 *   "&oslash;".convert_accented_entities # => "o"
 *   "&uuml;".convert_accented_entities # => "u"
 *
 * Note: This does not do any conversion of Unicode/Ascii accented-characters. For that
 * functionality please use toASCII.*/
StringEx.prototype.convertAccentedEntities = function convertAccentedEntities(string) {
  return string.replace(/&([A-Za-z])(grave|acute|circ|tilde|uml|ring|cedil|slash);/g, '$1');
};

// Converts HTML entities (taken from common Textile/RedCloth formattings) into plain text formats.
StringEx.prototype.convertMiscEntities = function convertMiscEntities(string) {
  var temp = string;
  utils.each([
    { "#822[01]" : "\"" },
    { "#821[67]" : "'" },
    { "#8230" : "..." },
    { "#8211" : "-" },
    { "#8212" : "--" },
    { "#215" : "x" },
    { "gt" : ">" },
    { "lt" : "<" },
    { "(#8482|trade)" : "(tm)" },
    { "(#174|reg)" : "(r)" },
    { "(#169|copy)" : "(c)" },
    { "(#38|amp)" : "and" },
    { "nbsp" : " " },
    { "(#162|cent)" : " cent" },
    { "(#163|pound)" : " pound" },
    { "(#188|frac14)" : "one fourth" },
    { "(#189|frac12)" : "half" },
    { "(#190|frac34)" : "three fourths" },
    { "(#176|deg)" : " degrees" }
  ], function(entity) {
    for (var key in entity)
      temp = temp.replace('&' + key + ';', entity[key]);
  });
  return temp.replace(/&[^;]+;/, '');
};

/* Converts various common plaintext characters to a more URI-friendly representation.
 *
 * Note: Because this method will convert any & symbols to the string "and",
 * you should run any methods which convert HTML entities (convert_html_entities and convert_misc_entities)
 * before running this method. */
StringEx.prototype.convertMiscCharacters = function convertMiscCharacters(string) {
  var temp = string.replace(/\.{3,}/g, ' dot dot dot '); // Catch ellipses before single dot rule!
  
  // Special rules for money
  var rules = [
    { match: /(\s|^)\$(\d+)\.(\d+)(\s|$)/g, replacement: '$2 dollars $3 cents ' },
    { match: /(\s|^)£(\d+)\.(\d+)(\s|$)/g, replacement: '$2 pounds $3 pence ' },
    { match: /\s*&\s*/g, replacement: 'and ' },
    { match: /\s*#/g, replacement: 'number ' },
    { match: /\s*@\s*/g, replacement: 'at ' },
    { match: /(\S|^)\.(\S)/g, replacement: '$1 dot $2 ' },
    { match: /(\s|^)\$(\d*)(\s|$)/g, replacement: '$2 dollars ' },
    { match: /(\s|^)£(\d*)(\s|$)/g, replacement: '$2 pounds ' },
    { match: /(\s|^)¥(\d*)(\s|$)/g, replacement: '$2 yen ' },
    { match: /\s*\*\s*/g, replacement: 'star ' },
    { match: /\s*%\s*/g, replacement: 'percent ' },
    { match: /\s*(\\|\/)\s*/g, replacement: 'slash ' }
  ];

  utils.each(rules, function(rule) {
    temp = temp.replace(rule.match, rule.replacement) + ' ';
  });

  return temp.replace(/(^|\w)'(\w|$)/, '$1$2').replace(/[\.,:;()\[\]\/\?!\^'"_]/, ' ');
};

/* Replace runs of whitespace in string. Defaults to a single space but any replacement
 * string may be specified as an argument.*/
StringEx.prototype.replaceWhitespace = function replaceWhitespace(string, replace) {
  replace = typeof(replace) != 'undefined' ? replace : ' ';

  return string.replace(/[\s]+/g, replace);
};

/* Removes specified character from the beginning and/or end of the string and then performs
 * squeeze, condensing runs of the character within the string. */
StringEx.prototype.collapse = function collapse(string, character) {
  character = typeof(character) != 'undefined' ? character : ' ';

  var start = new RegExp('^' + character + '*');
  var end = new RegExp(character + '*$');

  var temp = string.replace(start, '').replace(end, '');
  return utils.squeeze(temp, character);
};

/* Returns string of random characters with a length matching the specified limit. Excludes 0
 * to avoid confusion between 0 and O. */
StringEx.prototype.randomChars = function randomChars(limit) {
  // If no limit was passed, return a string with a sane default limit
  limit = limit || 32;
  var strongAlphanumerics = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    1, 2, 3, 4, 5, 6, 7, 8, 9
  ];

  var collected = [];
  for (i = 0; i < limit; i++) {
    collected.push(strongAlphanumerics[Math.floor(Math.random() * 61)]);
  }

  return collected.toString().replace(/[,]/g, '');
};

// Converts a string to it's pure ASCII representation
StringEx.prototype.toASCII = function toASCII(string) {
  return Unidecoder.decode(string);
};

/* Returns a new string or RegExp (depending on which one was passed in as target).
 * EXAMPLES:
 *    stringex.interpolate('yellow #{0}', 'moon')    #=> 'yellow moon'
 *    stringex.interpolate(/^[#{0}]$/g, '\\w')       #=> /^[\w]$/g
 *    stringex.interpolate('My #{0} is #{name}', 'name', {
 *      name: 'Paul'
 *    })                                             #=> 'My name is Paul'
 * NOTES:
 *    1.) The arguments object is used here to allow for an unlimited number of parameters.
 *    2.) You can mix and match interpolation types (named, indexed), but in order to
 *        use named variables, you must pass in an object with those names as properties.
 *        Objects are ignored for indexing (they will only be used for replacing named variables)
 *        so the order of the parameters is important, with Objects being the only exception. */
StringEx.prototype.interpolate = function interpolate(target) {
  return interpolater(target, [].slice.apply(arguments));
};

/* Returns a new string where runs of the same character that occur
 * in this set are replaced by a single character. If no arguments are given,
 * all runs of identical characters are replaced by a single character.
 * Repeated whitespace will always be squeezed.
 *
 * EXAMPLES:
 *     stringex.squeeze('yellow moon')                #=> "yelow mon"
 *     stringex.squeeze('  now   is  the', ' ')       #=> " now is the"
 *     stringex.squeeze('putters shoot balls', 'm-z') #=> "puters shot balls"
 */
StringEx.prototype.squeeze = function squeeze(string, replace) {
  if (!string || string.length == 1) return string;

  if (!replace) return string.replace(/([\w\s])\1+/g, '$1');
  else {
    var rx;
    if (/^[\w]\-[\w]$/.test(replace)) {
      var start = replace[0];
      var end = replace[2];
      var upper = start.toUpperCase() + '-' + end.toUpperCase();
      var lower = start.toLowerCase() + '-' + end.toLowerCase();
      rx = new RegExp('([' + upper + lower + '\\s])\\1+', 'g');
      return string.replace(rx, '$1');
    } else {
      if (string.trim()) return string.replace(/([\s])\1+/g, '$1');
      else {
        rx = new RegExp('([' + replace + '])\\1+', 'g');
        return string.replace(rx, '$1');
      }
    }
  }
};

module.exports = new StringEx();

// Extend StringEx to allow for chaining
utils.mixin(new StringEx());
