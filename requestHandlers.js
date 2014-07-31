var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),  
	util = require('util');

function start(response) {
	console.log("Request handler 'start' was called");
	
	var body = '<html>' +
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html";charset=UTF-8" />' +
		'</head>' +
		'<body>' +
		'<form action="/upload" enctype="multipart/form-data" method="post">' +
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
	var uploadPath = "d:/tmp";
	var form = new formidable.IncomingForm();
	
	console.log("About to parse");
	/*form.parse(request, function(error, fields, files) {
		console.log("Parsing done");
	*/	
	form.uploadDir = uploadPath;
	form.keepExtensions = true;

	form
		.on('error', function(err) {
			console.log("Error called")
			throw err;
		})

		.on('field', function(field, value) {
			console.log("Field handled")
			//receive form fields here
		})

		/* this is where the renaming happens */
		.on ('fileBegin', function(name, file){
				//rename the incoming file to the file's name
				file.path = form.uploadDir + "/" + file.name;
				console.log("Begin file " + file.path);
		})

		.on('file', function(field, file) {
			//On file received
			console.log("File received " + file);
		})

		.on('progress', function(bytesReceived, bytesExpected) {
			//self.emit('progess', bytesReceived, bytesExpected)

			var percent = (bytesReceived / bytesExpected * 100) | 0;
			process.stdout.write('Uploading: %' + percent + '\r');
		})

		.on('end', function() {
			console.log("Ended");

		});
		
		form.parse(request, function(err, fields, files) {
			console.log("Receive file");
		});
	
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	//});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("d:/tmp/test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;