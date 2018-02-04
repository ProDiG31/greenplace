const express = require('express');
// const fs = require('fs');
const mysql = require('mysql');
const _ = require('lodash');

const file = require('./querys/arbres.json');

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
      console.log(`Error connecting to Db = ${err.stack}`);
    } else {
      console.log('Connection established');
    }
  });

  // routage vers la fonction appelé
  next();
});

// Path /createDb
router.get('/createDb', () => {
  // Create DB
  connection.query('CREATE DATABASE IF NOT EXISTS dbgreenplace', (err) => {
    if (err) throw err;
    console.log('Database created or existing');
  });

  // load create script
  const sql1 = `
      CREATE TABLE IF NOT EXISTS user 
      ( 
        user_id      INT NOT NULL auto_increment, 
        email        VARCHAR(80) NOT NULL, 
        display_name VARCHAR(50) NOT NULL, 
        password     VARCHAR(60) NOT NULL, 
        PRIMARY KEY (user_id), 
        UNIQUE INDEX (email) 
      ); `;
  const sql2 = `
  CREATE TABLE IF NOT EXISTS tree 
  ( 
    user_id               INT NOT NULL, 
    tree_id               INT NOT NULL auto_increment, 
    geo_shape_coordinates GEOMETRY, 
    patrimoine            VARCHAR(22) CHARACTER SET utf8, 
    adresse               VARCHAR(18) CHARACTER SET utf8, 
    geometry_point        GEOMETRY, 
    record_date           DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (tree_id), 
    FOREIGN KEY (user_id) REFERENCES user(user_id) 
  );`;
  // Execute script
  connection.query(sql1, (err) => {
    if (err) throw err;
    console.log('db table "user" created or existing');
  });

  // Execute script
  connection.query(sql2, (err) => {
    if (err) throw err;
    console.log('db tables "tree" created or existing');
  });

  // fermeture de la connection
  connection.end();
});

router.get('/inputData', () => {
  let sql = 'INSERT INTO tree (user_id,geo_shape_coordinates, patrimoine, adresse, tree_id, geometry_point) VALUES';
  file.forEach((element) => {
    function fromJsontoGeoData(s) {
      let data = JSON.stringify(s);
      // data = _.replace(data, /\[/g, '(');
      // data = _.replace(data, /]/g, ')');
      // data = _.replace(data, /([0-9.]{10,20}),([0-9.]{10,20})/g, '$1 $2');
      // data = _.replace(data, /\),\(/g, ') (');
      // data = _.replace(data, /}/g, '\')');
      // data = _.replace(data, /{/g, '(\'');
      // data = _.replace(data, /U+002F/g, '');
      // data = _.replace(data, /U+005C/g, '');
      // data = _.replace(data, /{/g, '(\'');

      data = (`('${data}')`);
      return data;
    }
    const CHAR_QUOTE = '`';
    sql += `(1,ST_GeomFromGeoJSON(${CHAR_QUOTE + JSON.stringify(element.fields.geo_shape) + CHAR_QUOTE}),`;
    sql += `"${element.fields.patrimoine}",`;
    sql += `"${element.fields.adresse}",`;
    sql += `${element.fields.id},`;
    sql += `ST_GeomFromGeoJSON(${CHAR_QUOTE + JSON.stringify(element.geometry) + CHAR_QUOTE})`;
    // sql = _.replace(sql, /\\\\/g, ' ');
    // sql = _.replace(sql, /U+005C/g, ' ');
    sql += ',';
  });

  sql = `${sql.substring(0, sql.length - 1)};`;
  connection.query(sql, (err) => {
    if (err) {
      console.log('error: ', err);
    }
  });

  // fermeture de la connection
  // connection.end();
});
module.exports = router;
