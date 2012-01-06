var yaml  = require('js-yaml'),
	  utils = require('./utils');

var unidecoder = {

	codepoints: function codepoints(key, callback) {
		var doc = require(__dirname + '/unidecoder_data/' + key + '.yml').shift();
		callback(null, doc);
	},
	
	decode: function decode(string) {
		for (i = 0; i < string.length; i++) {
			c = string[i];
			if (c.match(/([^\x00-\x7f])/)) {
				codepoint = c.charCodeAt(0);
				codegroup = this.getCodeGroup(codepoint);
				this.codepoints(codegroup, function(err, doc) {
					if (err) return console.log(err);
					else {
						transliterated = doc[codepoint & 255];
						string = string.replace(new RegExp(c, 'g'), transliterated);
					}
				});
			}
		}

		return string;
	},

	getCodeGroup: function getCodeGroup(codepoint) {
		var decimal = codepoint >> 8;
		if (decimal.toString().length > 1) return 'x' + this.dec2hex(decimal);
		else return 'x0' + this.dec2hex(decimal);
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

}

module.exports = unidecoder;