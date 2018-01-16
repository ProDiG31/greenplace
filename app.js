const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const postman = require('postman');
const file = require('./app/data/arbres-d-alignement.json');

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
	//	console.log(res.picture)
	return count = Object.keys(res).length;
})

app.get('/dataMap', (req, res) => {
	arr = [];
	for (var val in file) {
		let coordinate = file[val].fields.geo_shape.coordinates;
		for (let i = 0; i < coordinate.length; i++) {
			flightPlanCoordinates = coordinate.map((obj) => {
				let robj = {
					lat: obj[1],
					lng: obj[0]
				}
				return robj;
			})
		}
		const arrTree = [file[val].fields.patrimoine, file[val].fields.adresse, file[val].record_timestamp, file[val].geometry.coordinates[1], file[val].geometry.coordinates[0], flightPlanCoordinates]
		arr.push(arrTree);
	}
	console.log("Return go");
	res.json(arr);
})


app.listen(3000);
