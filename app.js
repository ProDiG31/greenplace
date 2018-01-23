const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);

const file = require('./app/data/arbres-d-alignement.json');

app.use(bodyParser.json());

// path vers les ressources;
app.use('/css', express.static(`${__dirname}/views/css`));
app.use('/js', express.static(`${__dirname}/views/js`));
app.use('/data', express.static(`${__dirname}/views/data`));

// path de redirection
// Path /
app.get('/', (req, res) => {
  fs.readFile('./views/map.html', 'utf-8', (error, content) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(content);
  });
});

// Path /dataJson/:id
app.get('/dataJson/:id', (req, res) => {
  const { id } = req.params;
  for (let index = 0; index < file.length; index += 1) {
    if (file[index].recordid === id) {
      res.json(file[index]);
    }
  }
  res.redirect('back');
});

// Path /dataJson
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

    const arrTree = [val.fields.patrimoine,
      val.fields.adresse,
      val.record_timestamp,
      val.geometry.coordinates[1],
      val.geometry.coordinates[0],
      flightPlanCoordinates,
      val.recordid];

    arr.push(arrTree);
  });
  res.json(arr);
});

// Socket IO de communication en temps réel ;
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('socket connected');

  // Action de tracking des données d'un tree;
  socket.on('showTree', (idTree) => {
    console.log('showTree handled');
    let dataTreeSelect = null;
    for (let index = 0; index < file.length; index += 1) {
      if (file[index].recordid === idTree.id) {
        console.log('tree found');
        dataTreeSelect = (file[index]);
        const treeDetail = `<th id= ${dataTreeSelect.recordid}> ${dataTreeSelect.recordid}</th>` +
                      `<td> ${dataTreeSelect.fields.adresse}</td>` +
                      `<td>${dataTreeSelect.record_timestamp}</td>` +
                      `<td>[${dataTreeSelect.geometry.coordinates[1]},${dataTreeSelect.geometry.coordinates[0]}]</td>` +
                      '<td><div class="btn-group" role="group" aria-label="Basic example">' +
                      '<button type="button" class="btn btn-primary">Stop tracking</button>' +
          `<a id="editTree" data-toggle="modal" data-id="${dataTreeSelect.recordid}" class="btn btn-warning">Edit</a>` +
          // `<button type="button" id="editTree" class="btn btn-warning" data-toggle="modal" data-target="#modalEditTree" data-id="${dataTreeSelect.recordid}">Edit</button>`
        '<button type="button" class="btn btn-danger">Remove</button>' +
                      '</div></td>';
        socket.emit('display tree', treeDetail);
      }
    }
  });
});

server.listen(3000);

console.log('App Launched on post 3000 ');
// app.listen(3000);
