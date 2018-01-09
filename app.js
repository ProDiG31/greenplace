var http = require('http');
var url = require('url');


http.createServer(function (req, res) {
    
	var page = url.parse(req.url).pathname;
	
	console.log(page);
	
	res.writeHead(200, {
		'content-type': 'text/plain'
	});
	
	res.write('Hello world');
	res.end();
	
	console.log("node test")

}).listen(3000);
