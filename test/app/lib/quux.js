var __dirname = '/';
var __filename = '/quux.js';

(function(_require) {
	var require = _require('ti-node-require')(__dirname);


	module.exports = function() {
		console.log('quux');
	};


})(require);