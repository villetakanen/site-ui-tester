var url = require('url');
var Structure = function(){
	var hide = {};
	var reveal = {};
	reveal.data = function(resource, original){
		var data = {};
		data.url = resource;
		var urlObject = url.parse(resource);
		data.host = urlObject.host;
		data.pathBase64 = hide.base64(urlObject.path);
		if(original.info.length > 0){
			var info = JSON.parse(original.info[0]);
			data.timeISO = new Date(info.time).toISOString();
			data.time = info.time;
			if(info.diff){
				data.diff = {
					message: 'Changes detected',
					previousISO: new Date(Number(info.diff.left)).toISOString(),
					previous: info.diff.left,
					screenshot: info.diff.screenshot,
					directory: info.dir
				};
			} else {
				data.diff = {
					message: 'No changes'
				};
			}
		} else {
			data.timeISO  = new Date().toISOString();
			data.time = new Date().toString();
			data.diff = {
				message: 'No changes'
			};
		}

		if(original.error.length > 0){
			data.console = {
				message: 'Console errors detected',
				errors: original.error
			};
		} else {
			data.consoleErrors = null;
			data.console = {
				message: 'No errors detected',
				errors: null
			};
		}
		data.monitoredIn = original.monitoredIn;
		data.console.notice = original.notice;
		return data;
	};
	hide.base64 = function(data){
	    if(data instanceof Buffer){
	        //do nothing for quickly determining.
	    } else if(data instanceof Array){
	        data = new Buffer(data);
	    } else {
	        //convert to string.
	        data = new Buffer(String(data || ''));
	    }
	    return data.toString('base64');
	};
	return reveal;
}();
module.exports = Structure;