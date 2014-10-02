var basePath = __dirname;
var Config = require('./modules/config');
var App = require('./modules/checksettings');

Config.read(basePath, function(config){
	App.start(config, basePath);
});