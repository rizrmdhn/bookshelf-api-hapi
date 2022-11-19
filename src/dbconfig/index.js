const mysql = require('mysql');

const dbConfig = {
  multipleStatements: true,
  host: 'remotemysql.com',
  user: 'cZODE1Dfez',
  password: 'NJZ8flVKhh',
  database: 'cZODE1Dfez',
};

const connection = mysql.createPool(dbConfig);

connection.getConnection(function(error, getConnection) {
      if (error) {
        console.log('error when connectiong to db:', error);
      } else {
        console.log('Mysql terkoneksi');
      }
    });
  

module.exports = connection;