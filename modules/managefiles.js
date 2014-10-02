var fs = require('fs');
var findRemoveSync = require('find-remove');
var ManageFiles = function(){
	var hide = {};
	var reveal = {};
	reveal.deleteOld = function(basePath, data, startTime, monitorConfig){
		hide.basePath = basePath;
		hide.dataPath = '/';
		if(monitorConfig.path){
			hide.dataPath = (monitorConfig.path.root) ? '/'+monitorConfig.path.root+'/' : '/';
		}
		hide.handleData(data, startTime);
	};

	hide.handleData = function(data, startTime){
		var currentTime = new Date().getTime();
		var timeDiffInSeconds = (currentTime - startTime) / 1000;
		for (var i = data.length - 1; i >= 0; i--) {
			var path = hide.basePath +  hide.dataPath  + data[i].host + '/' +data[i].pathBase64;
			var result = findRemoveSync(path, {age: {seconds: timeDiffInSeconds}});
		};
	};

	hide.checkFolders = function(path){
		var folderContains = fs.readdirSync(path);
		console.log(folderContains);
		for (var i = folderContains.length - 1; i >= 0; i--) {
			var fullPath = path+'/'+folderContains[i];
			if(fs.lstatSync(fullPath).isDirectory()){
				console.log(fullPath);
				hide.checkFolders(fullPath);
			}
		};
	};

	return reveal;
}();
module.exports = ManageFiles;