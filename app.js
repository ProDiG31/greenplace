var http = require('http');
var url = require('url');
var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDrmAKRosfqSjSXvy2aLhZC7yyhVZ66JAs'
});


http.createServer(function (req, res) {

	var page = url.parse(req.url).pathname;

	console.log(page);

	res.writeHead(200, {
		'content-type': 'text/plain'
	});

	res.write('Hello world');

	// Geocode an address.
	googleMapsClient.geocode({
		address: '1600 Amphitheatre Parkway, Mountain View, CA'
	}, function (err, response) {
		if (!err) {
			console.log("GEOCODE OK !")
			console.log(response.json.results);
		}
	});

	res.end();

	console.log("node test")

}).listen(3000);
