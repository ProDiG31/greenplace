var http = require('http');

http.createServer(function(req,res){

	res.writeHead(200,{
		'content-type': 'text/plain'
	});
	res.write('Hello world');
	res.end();
	console.log("node test")
}).listen(3000);