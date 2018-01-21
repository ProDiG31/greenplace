const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');

const app = express();
const file = require('./app/data/arbres-d-alignement.json');

app.use(bodyParser.json());


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
  file.forEach((val) => {
    let coordinate = val.fields.geo_shape.coordinates;
    let flightPlanCoordinates;

    if (val.fields.geo_shape.type === 'MultiLineString') {
      coordinate = _.flatten(coordinate);
    }

    for (let i = 0; i < coordinate.length; i += 1) {
      flightPlanCoordinates = coordinate.map((obj) => {
        const robj = {
          lat: obj[1],
          lng: obj[0],
        };
        return robj;
      });
    }

    const markerCoord = val.geometry.coordinates;
    const arrTree = [val.fields.patrimoine, val.fields.adresse, val.record_timestamp, markerCoord[1], markerCoord[0], flightPlanCoordinates];
    arr.push(arrTree);
  });
  res.json(arr);
});


console.log('App Launched on post 3000 ');
app.listen(3000);
