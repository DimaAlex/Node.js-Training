 var http = require('http');
 var fs = require('fs');
 var url = require('url');
 var path = require('path');
 
 var ROOT = __dirname + "/public/";
 
 http.createServer(function(req, res) {
	if (!checkAccess(req)) {
		res.statusCode = 403;
		res.end("Tell me the secret to access!");
		return;
	}
	
	sendFileSafe(url.parse(req.url).pathname, res);
 }).listen(3000);
 
 function checkAccess(req) {
	return url.parse(req.url, true).query.secret == 'o_O';
 }
 
 function sendFileSafe(filepath, res) {
	try {
		filepath = decodeURIComponent(filepath);
	} catch (e) {
		res.statusCode = 400;
		res.end("Bad request");
		return;
	}
	
	if(~filepath.indexOf('\0')) {
		res.statusCode = 400;
		res.end("Bad request");
		return;
	}
	
	filepath = path.normalize(path.join(ROOT, filepath));
	
	if (filepath.indexOf(ROOT) != 0) {
		res.statusCode = 404;
		res.end("File not found");
		return;
	}
	
	fs.stat(filepath, function(err, stats) {
		if (err || !stats.isFile()) {
			res.statusCode = 404;
			res.end("File not found");
			return;
		}
		
		sendFile(filepath, res);
	});
 }
 
 function sendFile(filepath, res) {
	fs.readFile(filepath, function(err, content) {
		if (err) throw err;
		
		var mime = require('mime').lookup(filepath);
		res.setHeader('Content-Type', mime + "; charset=utf-8");
		res.end(content);
	});
 }