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

app.use('/css', express.static('./views/css'));
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

app.get('/data', (req, res) => {
	fs.readFile('./app/data/arbres.json', 'utf-8', function (error, content) {
		res.setHeader('Content-Type', 'application/json');
		res.send(content);
	});
})

app.listen(3000);
