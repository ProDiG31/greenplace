const express = require('express');
// const http = require('http');
// const url = require('url');
const fs = require('fs');
// const postman = require('postman');
const file = require('./app/data/arbres-d-alignement.json');
const _ = require('lodash');
const bodyParser = require('body-parser');
// const _ = require('lodash/core');
const app = express();
app.use(bodyParser.json());
// const googleMapsClient = require('@google/maps').createClient({
//  key: 'AIzaSyDrmAKRosfqSjSXvy2aLhZC7yyhVZ66JAs'
// });

app.use('/css', express.static(`${__dirname}/views/css`));
app.use('/js', express.static(`${__dirname}/views/js`));
app.use('/data', express.static(`${__dirname}/views/data`));

app.get('/', (req, res) => {
  fs.readFile('./views/map.html', 'utf-8', (error, content) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(content);
  });
});

app.get('/dataJson', (req, res) => {
  fs.readFile('./app/data/arbres-d-alignement.json', 'utf-8', (error, content) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(content);
  });
});

app.get('/tree/:id', (req, res) => {
  const { id } = req.params;
  let tree;

  for (let index = 0; index < JSON.length; index += 1) {
    tree = file[index];
    console.log(`tree id = ${tree.recordid}  _ ID = ${id}`);

    if (tree.recordid === id) {
      console.log('tree found !');
      break;
    }
    tree = null;
  }
  console.log('tree found2 !');
  if (tree != null) res.json(tree);
});

app.get('/dataMap', (req, res) => {
  const arr = [];
  file.forEach(val => {
    let coordinate = file[val].fields.geo_shape.coordinates;
    let flightPlanCoordinates;

    if (file[val].fields.geo_shape.type == 'MultiLineString') {
      coordinate = _.flatten(coordinate);
    }

    for (let i = 0; i < coordinate.length; i++) {
      flightPlanCoordinates = coordinate.map((obj) => {
        const robj = {
          lat: obj[1],
          lng: obj[0],
        };
        return robj;
      });
    }

    const arrTree = [file[val].fields.patrimoine, file[val].fields.adresse, file[val].record_timestamp, file[val].geometry.coordinates[1], file[val].geometry.coordinates[0], flightPlanCoordinates];
    arr.push(arrTree);
  }
  res.json(arr) 
);
});


app.listen(3000);
