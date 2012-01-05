var yaml  = require('yaml'),
	utils = require('./utils'),
	fs	  = require('fs');

var unidecoder = {
	
	decode: function decode(string) {
		for (i = 0; i < string.length; i++) {
			c = string[i];
			if (c.match(/([^\x00-\x7f])/)) {
				codepoint = c.charCodeAt(0);
				codegroup = unidecoder.convertChar2CodePoint(c);
				console.log('./unidecoder_data/x' + codegroup.toLowerCase() + '.yml');
				fs.readFile('./unidecoder_data/x' + codegroup.toLowerCase() + '.yml',
					function(err, contents) {
						contents = contents.toString();
						console.log(yaml.eval(contents));
						transliterated = '';
						string = string.replace(new RegExp(c, 'g'), transliterated);
					});
			}
		}

		return string;
	},

	dec2char: function dec2char(n) {
		var result = '';
		if (n <= 0xFFFF) { result += String.fromCharCode(n); } 
		else if (n <= 0x10FFFF) {
			n -= 0x10000
			result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
		}
		return result;
	},

	dec2hex: function dec2hex (n) {
		return (n+0).toString(16).toUpperCase();
	},

	dec2hex2: function dec2hex2 (n) {
		var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
		return hexequiv[(n >> 4) & 0xF] + hexequiv[n & 0xF];
	},

	dec2hex4: function dec2hex4 (n) {
		var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
		return hexequiv[(n >> 12) & 0xF] + hexequiv[(n >> 8) & 0xF] + hexequiv[(n >> 4) & 0xF] + hexequiv[n & 0xF];
	},

	convertChar2CodePoint: function convertChar2CodePoint(c) { 
		var haut = 0;
		var n = 0;
		var codepoint = '';
		for (var i = 0; i < c.length; i++) {
			var b = c.charCodeAt(i); 
			if (b < 0 || b > 0xFFFF) {
				codepoint += 'Error in convertChar2CP: byte out of range ' + unidecoder.dec2hex(b) + '!';
			}
			if (haut != 0) {
				if (0xDC00 <= b && b <= 0xDFFF) {
					codepoint += unidecoder.dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
					haut = 0;
					continue;
				}
				else {
					codepoint += 'Error in convertChar2CP: surrogate out of range ' + unidecoder.dec2hex(haut) + '!';
					haut = 0;
				}
			}
			if (0xD800 <= b && b <= 0xDBFF) {
				haut = b;
			}
			else {
				codepoint += unidecoder.dec2hex(b) + ' ';
			}
		}
		return codepoint.substring(0, codepoint.length-1);
	},

	_codeGroup: function _codeGroup(unpackedChar) {
		return "x%02x" % (unpackedChar >> 8);
	},

	_grouped_point: function _groupedPoint(unpackedChar) {
		return unpackedChar & 255;
	}

}

module.exports = unidecoder;