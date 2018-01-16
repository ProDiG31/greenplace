const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const postman = require('postman');
//const request = require('fetch.io');
const app = express();
//const googleMapsClient = require('@google/maps').createClient({
//  key: 'AIzaSyDrmAKRosfqSjSXvy2aLhZC7yyhVZ66JAs'
//});

app.use('/css', express.static(__dirname + '/views/css'));
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/data', express.static(__dirname + '/views/data'));

app.get('/', (req, res) => {
	fs.readFile('./views/map.html', 'utf-8', function (error, content) {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.end(content);
	});
});

app.get('/dataJson', (req, res) => {
	fs.readFile('./app/data/arbres-d-alignement.json', 'utf-8', function (error, content) {
		res.setHeader('Content-Type', 'application/json');
		res.send(content);
	});
})

app.get('/dataLength', (res) => {
	//	var json = res;
	console.log(res.picture)
	return count = Object.keys(res).length;
})

app.get('/dataMap', (req, res) => {
	fs.readFile("./app/data/arbres-d-alignement.json", 'utf-8', (error, content) => {
		var data = JSON.parse(content)
		const arr = []

		data.forEach((val) => {
			var contentString = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">' + val.fields.patrimoine + '</h1>' +
				'<div id="bodyContent">' +
				'<p><b>Location : </b>' + val.fields.adresse + '</p>' +
				'<p><b> Recorded : </b>' + val.record_timestamp + '</p>' +
				'<p><b> Coordinate : </b>' + '[' + val.geometry.coordinates[1] + ',' + val.geometry.coordinates[0] + ']' + '</p>' +
				'</div>' +
				'</div>';

			var infowindow = new google.maps.InfoWindow({
				content: contentString,
				position: {
					lat: val.geometry.coordinates[1],
					lng: val.geometry.coordinates[0]
				}
			});

			var imageTree = "/data/deciduous-tree.png";

			let coordinate = val.fields.geo_shape.coordinates;
			let flightPlanCoordinates = new Array(coordinate.length);

			for (let i = 0; i < coordinate.length; i++) {
				flightPlanCoordinates[i] = {
					lat: coordinate[i][1],
					lng: coordinate[i][0]
				};
			}

			var flightPath = new google.maps.Polyline({
				path: flightPlanCoordinates,
				geodesic: true,
				strokeColor: '#73BA37',
				strokeOpacity: .6,
				strokeWeight: 6
			});
			arr.push(flightPath)
		})
//		console.log("Got response: " + data.picture);
		return(arr)
	})

})

app.listen(3000);
