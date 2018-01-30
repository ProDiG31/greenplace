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
  password: 'root',
  database: 'dbGreenPlace',
  port: '3306',
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
router.get('/createDb', (req, res) => {
  // load create script
  const fileCreate = fs.readFileSync(`${__dirname}/querys/create.sql`, 'utf-8');
  // console.log(`file = ${fileCreate}`);
  // console.log(`result1 = ${res}`);
  // console.log(util.inspect(res));
  // res.render(res);
  // Execute script
  connection.query(fileCreate, (err, result) => {
    if (err) {
      console.log('error: ', err);
    } else {
      console.log('db tables created ok');
    }
    // console.log(`result2 =${util.inspect(result)}`);
  });
});

router.get('/inputData', (req, res) => {
  const fileInput = fs.readFileSync(`${__dirname}/querys/insertData.sql`, 'utf-8');
  connection.query(fileInput, (err, result) => {
    if (err) {
      console.log('error: ', err);
    } else {
      console.log('db tables input ok');
    }
  });
});
module.exports = router;
