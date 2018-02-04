// Module import by npm
const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const pug = require('pug');

// Module instance
const app = express();
const server = require('http').createServer(app);

// Router instance
const router = express.Router();

// Custom module in ./app/
const dbmysql = require('./app/dbmysql');

// json file in used;
const file = require('./app/data/arbres-d-alignement.json');

router.use(bodyParser.json());

// path vers les ressources;
router.use('/css', express.static(`${__dirname}/views/css`));
router.use('/js', express.static(`${__dirname}/views/js`));
router.use('/data', express.static(`${__dirname}/views/data`));

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  const date = new Date();
  console.log(`[Time]: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - [Method]: ${req.method} [URL]: ${req.url}`);
  next();
});

// Routage des actions de base de donnée sur le module dbmysql
router.use('/dbmysql', dbmysql);

// path de redirection
// Path /
router.get('/', (req, res) => {
  fs.readFile('./views/map.html', 'utf-8', (error, content) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(content);
  });
});

// Path /dataJson/:id
router.get('/dataJson/:id', (req, res) => {
  const { id } = req.param.id;
  for (let index = 0; index < file.length; index += 1) {
    if (file[index].recordid === id) {
      res.json(file[index]);
    }
  }
});

// Path /dataJson
router.get('/dataJson', (req, res) => {
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

// Instanciation de la Socket IO de communication en temps réel ;
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('socket connected');
  // Action de ajout d'un tree au tableau de tracking ;
  socket.on('showTree', (idTree) => {
    console.log('showTree handled');
    let dataTreeSelect = null;

    // Compilation du template;
    const compiledTemplate = pug.compileFile('views/template/tableRow.pug');

    for (let index = 0; index < file.length; index += 1) {
      if (file[index].recordid === idTree.id) {
        console.log('tree found');
        dataTreeSelect = (file[index]);
        // Compilation du template avec les données;
        const treeDetail = compiledTemplate({ dataTreeSelect });
        socket.emit('display tree', treeDetail);
      }
    }
  });

  socket.on('treeEditForm', (idTree) => {
    console.log('form request');
    for (let index = 0; index < file.length; index += 1) {
      if (file[index].recordid === idTree.id) {
        console.log('tree found');
        const dataTreeSelect = (file[index]);
        // console.log(dataTreeSelect);
        // console.log('heelo');
        const compiledTemplate = pug.compileFile('views/template/inputModal.pug');
        let treeForm = '';
        Object.keys(dataTreeSelect).forEach((key, index) => {
          if (dataTreeSelect && dataTreeSelect.hasOwnProperty(key)) {
            data = dataTreeSelect[key];
            treeForm += compiledTemplate({ data });
          }
        });
        socket.emit('treeEditFormThrow', treeForm);
      }
    }
    // $('#recordid').val(data.recordid);
    // $('#datasetid').val(data.datasetid);
    // $('#type').val(data.fields.geo_shape.type);
    // $('#coordinateslat').val(data.geometry.coordinates[1]);
    // $('#coordinateslng').val(data.geometry.coordinates[0]);
    // $('#patrimoine').val(data.fields.patrimoine);
    // $('#adresse').val(data.fields.adresse);
    // $('#timestamp').val(data.record_timestamp);
  });
});

// mount the router on the app
app.use('/', router);

// define listening port of server
server.listen(3000);
console.log('App Launched on post 3000 ');
