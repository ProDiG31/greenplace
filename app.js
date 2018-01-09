var http = require('http');
var google = require('node-google-api')('<<AIzaSyCamYwPoaT9GJlMOTyEbWZr37bhdGHgtDQ>>');
var GoogleMapsLoader = require('google-maps'); // only for common js environments 
 



http.createServer(function(req,res){

	GoogleMapsLoader.load(function(google) {
    new google.maps.Map(el, options);
	});
	
	res.writeHead(200,{
		'content-type': 'text/plain'
	});
	res.write('Hello world');
	res.end();
	console.log("node test")
}).listen(3000);