const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const router = express.Router();

// path vers les ressources;
router.use('/css', express.static(`${__dirname}/querys`));

// creation de l'objet connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbGreenPlace',
});

//  Log de d'appel sur le module dbmysql
router.use((req, res, next) => {
  const date = new Date();
  console.log(`[dbmysql] - [Time]: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - [Method]: ${req.method} [URL]: ${req.url}`);

  // etablisement de la connection avec la base de donnée
  connection.connect((err) => {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  // routage vers la fonction appelé
  next();

  // fermeture de la connection
  connection.end();
});

// Path /createDb
router.post('/createDb', (req, res) => {
  // load create script
  const file = fs.readFile('/query/create.sql');

  // Execute script
  connection.query(file, (err, result) => {
    // done();
    if (err) {
      console.log('error: ', err);
      process.exit(1);
    }
    console.log('db tables created ok');
    process.exit(0);
  });
});

// // Path /dataJson/:id
// router.get('/tree/:id', (req, res) => {
//   const { id } = req.param.id
// });
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

module.exports = router;
