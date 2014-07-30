var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),  util = require('util');;

function start(response) {
	console.log("Request handler 'start' was called");
	
	var body = '<html>' +
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html"; ' +
		'charset=UTF-8" />' +
		'</head>' +
		'<body>' +
		'<form action="/upload" enctype="multpart/form-data" method="post">' +
		'<input type="file" name="upload" multiple="multiple" />' +
		'<input type="submit" value="Upload File" />' +
		'</form>' +
		'</body>' +
		'</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called");
	
	var img = "d:/tmp/test.png";
	var form = new formidable.IncomingForm(), fields = {}, files = {};
	
	console.log("About to parse");
	form.parse(request, function(err, fields, files) {
		console.log("Parsing done");
		
		/* Possible error on Windows systems:
		   tried to rename to an already existing file */
		/*fs.exists(img, function(exists) {
			if (exists) { fs.unlink(img); }
			fs.rename(files.file.path, img);
		});*/
		console.log("Received: " + util.inspect(files));
		fs.rename(files.upload.path, "d:/tmp/test.png", function(error) {
			if (error) {
				fs.unlink("d:/tmp/test.png");
				fs.rename(files.upload.path, "d:/tmp/test.png");
			}
		});
	
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("d:/tmp/test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;