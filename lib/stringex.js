var utils = require('./utils');

var stringex = {

	// Create a URI-friendly representation of the string
	toUrl: function toUrl(string) {
		return utils.chain(string)
								.removeFormatting(string.toLowerCase())
								.replaceWhitespace(string, '-')
								.collapse(string, '-')
								.value();
	},

	/* Performs multiple text manipulations. Essentially a shortcut 
	 * for typing them all. View source below to see which methods are run. */
	removeFormatting: function removeFormatting(string) {
		return utils.chain(string)
								.stripHtmlTags(string)
								.convertAccentedEntities(string)
								.convertMiscEntities(string)
								.convertMiscCharacters(string)
								.collapse(string)
								.value();
								//.toASCII(string)
								//.collapse(string);
	},

	// Removes HTML tags from text.
	stripHtmlTags: function stripHtmlTags(string, leaveWhitespace) {
		leaveWhitespace = typeof(leaveWhitespace) != 'undefined' ? leaveWhitespace : false;

		var rx = /<[!\/?\[]?([\w:_-]+|--)(\s+(([\w:_-]+(\s*=\s*([A-Za-z0-9]+|('[^']*?'|"[^"]*?")))?)(\s+([\w:_-]+(\s*=\s*([A-Za-z0-9]+|('[^']*?'|"[^"]*?")))?))*))?\s*([!\/?\]]+|--)?>/;
		var leadingOrTrailingWhitespace = /^\s+|\s+$/g;
		var whitespace = /\s+/g;

		if (leaveWhitespace)
			return string.replace(rx, '').replace(leadingOrTrailingWhitespace, '');
		else
			return string.replace(rx, '').replace(whitespace, ' ').replace(leadingOrTrailingWhitespace, '');
	},

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
	convertAccentedEntities: function convertAccentedEntities(string) {
		return string.replace(/&([A-Za-z])(grave|acute|circ|tilde|uml|ring|cedil|slash);/, '$1');
	},

	// Converts HTML entities (taken from common Textile/RedCloth formattings) into plain text formats.
	convertMiscEntities: function convertMiscEntities(string) {
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
				string = string.replace('&' + key + ';', entity[key]);
		});
		string = string.replace(/&[^;]+;/, '');

		return string;
	},

	/* Converts various common plaintext characters to a more URI-friendly representation.
	 *  
	 * Note: Because this method will convert any & symbols to the string "and",
	 * you should run any methods which convert HTML entities (convert_html_entities and convert_misc_entities)
	 * before running this method. */
	convertMiscCharacters: function convertMiscCharacters(string) {
		string = string.replace(/\.{3,}/g, ' dot dot dot '); // Catch ellipses before single dot rule!
		
		// Special rules for money
		var rules = [
			{ match: /(\s|^)\$(\d+)\.(\d+)(\s|$)/g, replacement: '$2 dollars $3 cents' },
			{ match: /(\s|^)£(\d+)\.(\d+)(\s|$)/g, replacement: '$2 pounds $3 pence' },
			{ match: /\s*&\s*/g, replacement: 'and' },
			{ match: /\s*#/g, replacement: 'number' },
			{ match: /\s*@\s*/g, replacement: 'at' },
			{ match: /(\S|^)\.(\S)/g, replacement: '$1 dot $2' },
			{ match: /(\s|^)\$(\d*)(\s|$)/g, replacement: '$2 dollars' },
			{ match: /(\s|^)£(\d*)(\s|$)/g, replacement: '$2 pounds' },
			{ match: /(\s|^)¥(\d*)(\s|$)/g, replacement: '$2 yen' },
			{ match: /\s*\*\s*/g, replacement: 'star' },
			{ match: /\s*%\s*/g, replacement: 'percent' },
			{ match: /\s*(\\|\/)\s*/g, replacement: 'slash' }
		];

		utils.each(rules, function(rule) {
			string = string.replace(rule.match, rule.replacement);
		});

		return string.replace(/(^|\w)'(\w|$)/, '$1$2').replace(/[\.,:;()\[\]\/\?!\^'"_]/, ' ');
	},

	/* Replace runs of whitespace in string. Defaults to a single space but any replacement
	 * string may be specified as an argument.*/
	replaceWhitespace: function replaceWhitespace(string, replace) {
		replace = typeof(replace) != 'undefined' ? replace : ' ';

		return string.replace(/[\s]+/g, replace);
	},

	/* Removes specified character from the beginning and/or end of the string and then performs
	 * squeeze, condensing runs of the character within the string. */
	collapse: function collapse(string, character) {
		character = typeof(character) != 'undefined' ? character : ' ';

		return utils.chain(string.replace('^' + character + '*', '').replace(character + '*$', ''))
								.squeeze(string, character)
								.value();
	},
	
	/* Returns string of random characters with a length matching the specified limit. Excludes 0
	 * to avoid confusion between 0 and O. */
	randomChars: function randomChars(limit) {
		var strongAlphanumerics = [
			a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,
			A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
			1, 2, 3, 4, 5, 6, 7, 8, 9
		]

		var collected = [];
		for (var i = 0; i < limit; i++) {
			collected.push(strongAlphanumerics[Math.floor(Math.random() * 61)]);
		}

		return collected.toString().replace(/[,]/g, '');
	},

	toASCII: function toASCII(string) {
	  var ascii = '';
	  if(s.length > 0)
	    for(i=0; i<s.length; i++)
	    {
	      var c = ""+s.charCodeAt(i);
	      while(c.length < 3)
	       c = "0"+c;
	      ascii += c;
	    }
	  }
	  return ascii ;
	}
}

utils.mixin(stringex);

module.exports = stringex;