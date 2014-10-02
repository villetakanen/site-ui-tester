var fs = require('fs');
var Config = function(){
	var hide = {};
	var reveal = {};
	reveal.read = function(basePath, callback){
		hide.basePath = basePath;
		hide.config;
		var configJSON = hide.basePath + '/config.json';
		fs.readFile(configJSON, 'utf8', function (err, data) {
			if (err) {
				console.error('Error: ' + err);
				return;
			}
			hide.config = JSON.parse(data);
			callback(hide.config);
		});
	};
	return reveal;
}();

module.exports = Config;