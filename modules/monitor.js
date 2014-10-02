var Monitor = require('page-monitor');
var Structure = require('./structure');
var Monitoring = function(config, callback){
	self = {};
	self.resources = config.resources;
	self.monitorOptions = (config.settings.monitor) ? config.settings.monitor : {};
	self.monitorOptions.events = {
		beforeWalk: 5000
	};
	self.resourcesCount = self.resources.length;
	self.idx = 0;
	self.allInfos = [];

	self.handleMonitoring = function(cb){
		var monitor = new Monitor(self.resources[self.idx], self.monitorOptions);
		var startTime = new Date();
		monitor.capture(function(code){
			var data = {};
			var resource = self.resources[self.idx];
			var endTime = new Date();
			var loadTime = (endTime - startTime) / 1000;
			var data = monitor.log;
			data.monitoredIn = loadTime;
			var structuredData = Structure.data(resource, data);
				console.log('Current resource: '+resource+', checked in: '+loadTime+'s');
			self.allInfos.push(structuredData);
			self.idx++;
			if(self.idx < self.resourcesCount){
				cb(cb);
			} else {
				callback(self.allInfos);
				console.log('all resources monitored');
			}
		});

		
	monitor.on('debug', function (data) {
	    console.log('[DEBUG] ' + data);
	});
	monitor.on('error', function (data) {
	    console.error('[ERROR] ' + data);
	});
	};

	self.handleMonitoring(self.handleMonitoring);
};
module.exports = Monitoring;