var initMonitoring = require('./monitor');
var Log = require('./log');
var Mail = require('./mail');
var ManageFiles = require('./managefiles');
var fs = require('fs');

var checkSettings = function(){
	var hide = {};
	var reveal = {};
	hide.config = {};
	hide.watchFile = false;
	hide.processActive = false;
	hide.checkProcessArgv = function(){
		for (var i = process.argv.length - 1; i >= 0; i--) {
			if(process.argv[i] === '--watch'){
				hide.watchFile = (process.argv[i+1]) ? process.argv[i+1] : false;
			}
		};
	}
	hide.startFileWatch = function(){
		console.log('Watching changes on file: %s', hide.watchFile);
		fs.watchFile(hide.watchFile, function (curr, prev) {
			if(!hide.processActive){
				console.log('File changed');
				hide.processActive = true
				hide.runMonitor();
			}
		});
	}
	hide.runMonitor = function(){
		var startTime = new Date().getTime();
		Mail.init(hide.config, hide.basePath);
		initMonitoring(hide.config, function(data){
			Log(hide.basePath, data, function(data, logfile){
				Mail.send(data, logfile, function(){
					ManageFiles.deleteOld(hide.basePath, data, startTime, hide.config.settings.monitor);
				});
			});
			hide.processActive = false;
		});
	};
	reveal.start = function(config, basePath){
		hide.config = config;
		hide.basePath = basePath;
		hide.checkProcessArgv();
		if(hide.watchFile){
			hide.startFileWatch();
		} else {
			hide.runMonitor();
		}
	};
	return reveal;
}();

module.exports = checkSettings;