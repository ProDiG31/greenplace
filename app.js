const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const util = require('util');

const app = express();
const server = require('http').createServer(app);

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

// app.get('/tree/:id', (req, res) => {
//   const { id } = req.params;
//   // app.get(`/dataJson/${id}`, (res2) => {  });
// });

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

    const markerLng = val.geometry.coordinates[1];
    const markerLat = val.geometry.coordinates[0];
    const arrTree = [];
    arrTree[0] = val.fields.patrimoine;
    arrTree[1] = val.fields.adresse;
    arrTree[2] = val.record_timestamp;
    arrTree[3] = markerLng;
    arrTree[4] = markerLat;
    arrTree[5] = flightPlanCoordinates;
    arrTree[6] = val.recordid;
    arr.push(arrTree);
  });
  res.json(arr);
});
// Socket IO de communication en temps réel ;
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('socket connected');
  socket.on('myClick', (data) => {
    console.log(`myClick detected = ${(data)}`);
    // socket.broadcast.emit('myClick', data);
  });

  socket.on('showTree', (idTree) => {
    console.log('showTree handled');
    // console.log(`${util.inspect(idTree)}`);
    let dataTreeSelect = null;
    for (let index = 0; index < file.length; index += 1) {
      // console.log(`i = ${index}, id =  ${file[index].recordid} compared to ${idTree}`);
      if (file[index].recordid === idTree.id) {
        console.log('tree found');
        dataTreeSelect = (file[index]);
        const treeDetail = `${'<div id="bodyContent">' +
                      '<p><b>Location : </b>'}${dataTreeSelect.fields.adresse}</p>` +
                      `<p><b> Recorded : </b>${dataTreeSelect.record_timestamp}</p>` +
                      `<p><b> Coordinate : </b>[${dataTreeSelect.geometry.coordinates[1]},${dataTreeSelect.geometry.coordinates[0]}]</p>` +
                      '</div>';
        socket.emit('display tree', treeDetail);
      }
    }

    // { app.get(`/dataJson/${idTree}`, (dataTreeSelect) => {
    //   console.log(`call selectTree = ${dataTreeSelect}`);
    //   // tableData.push(dataTreeSelect);

    //   // $('#table').append($('<li>').text(treeDetail));
    // }); }
    // window.scrollTo(0, document.body.scrollHeight);
  });
});

// io.on('/tree/:id', (req, socket) => {
//   const { id } = req.params;
//   console.log(`Un arbre cliqué ${id}!`);
//   socket.emit('message', 'Vous êtes bien connecté !');
// });

// io.on('connection', (client) => {
//   client.on('event', (data) => {});
//   // client.on('disconnect', () => {});
// });

server.listen(3000);

console.log('App Launched on post 3000 ');
// app.listen(3000);
