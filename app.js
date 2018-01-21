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

app.get('/dataJson/:id', (req, res) => {
  const { id } = req.params;
  for (let index = 0; index < file.length; index += 1) {
    if (file[index].recordid === id) {
      res.json(file[index]);
    }
  }
  res.redirect('back');
});

app.get('/dataJson', (req, res) => {
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
    const arrTree = [val.fields.patrimoine, val.fields.adresse, val.record_timestamp, markerCoord[1], markerCoord[0], flightPlanCoordinates, val.recordid];
    arr.push(arrTree);
  });
  res.json(arr);
});


console.log('App Launched on post 3000 ');
app.listen(3000);
