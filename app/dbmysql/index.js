const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const util = require('util');

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
router.get('/createDb', (req) => {
  // load create script
  const file = fs.readFileSync(`${__dirname}/querys/create.sql`, 'utf-8');
  console.log(`file = ${file}`);
  // console.log(`result1 = ${res}`);
  // console.log(util.inspect(res));
  // res.render(res);
  // Execute script
  connection.query(file, (err, result) => {
    if (err) {
      console.log('error: ', err);
    }
    console.log('db tables created ok');
    console.log(`result2 =${util.inspect(result)}`);
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
