var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');

var Mail = function(){
	var hide = {};
	var reveal = {};

	reveal.init = function(config, basePath){
		hide.basePath = basePath;
		hide.config = config.settings.mail;
		var currentSettings  = hide.config[hide.config.currentService];
		hide.transporter = nodemailer.createTransport(smtpTransport(currentSettings));
	};

	reveal.send = function(data, logfile, callback){
		hide.logfile = logfile;
		var formattedData = hide.handleData(data);
		hide.handleEmailSend(formattedData, callback);
	};

	hide.handleData = function(data){
		var messageData = [];
		var attachments = [];
		for (var i = data.length - 1; i >= 0; i--) {
			var mailData = {};
			var screenshotData = {};
			mailData.title = 'Resource: '+data[i].url;
			mailData.message = data[i].diff.message;
			if(data[i].diff.screenshot){
				screenshotData = {
					filename: data[i].url.replace(/\//g,'_') + '.png',
					content: fs.createReadStream(data[i].diff.screenshot)
				}; 
				attachments.push(screenshotData);
			}
			messageData.push(mailData);
		};
		attachments.push({
			filename: 'logfile.json',
			content: fs.createReadStream(hide.logfile)
		});
		var message = hide.formatMessage(messageData);
		return {
			message: message,
			attachments: attachments
		}
	};
	hide.formatMessage = function(data){
		var text = '';
		text += 'Monitor results: \n\n\n';
		for (var i = data.length - 1; i >= 0; i--) {
			text += data[i].title +': '+data[i].message;
			text += '\n\n';
		};
		return text;
	};
	hide.handleEmailSend = function(data, callback){
		var messageOptions = hide.config.messageOptions;
		hide.transporter.sendMail({
		    from: messageOptions.senderEmail,
		    to: messageOptions.receiverEmail,
		    subject: messageOptions.subject,
		    text: data.message,
		    attachments: data.attachments
		}, function(err, info){
			//if(err) throw new Error(err);
			if(!err) console.log('Email sent to address: '+messageOptions.receiverEmail);

			callback();
		});
	};

	return reveal;
}();

module.exports = Mail;