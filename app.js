var http = require('http');
var url = require('url');

var GoogleMapsLoader = require('google-maps'); // only for common js environments 

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

	//Load google map
	GoogleMapsLoader.load(function (google) {
		new google.maps.Map(el, options);
	});	
	
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
