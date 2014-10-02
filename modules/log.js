var fs = require('fs-extra');

var Log = function(basePath, data, callback){
	var isoTime = new Date().toISOString().replace(/:/g,'-');
	var folder = basePath+'/logs/';
	var outputFilename = folder+'monitored-data-'+isoTime+'.json';
	fs.mkdirs(folder, function(err){
		if (err) return console.error(err);
		fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
		    if(err) {
		      console.error(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		      callback(data, outputFilename);
		    }
		}); 
	});	
};
module.exports = Log;