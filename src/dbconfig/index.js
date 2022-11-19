const mysql = require('mysql');

const dbConfig = {
  multipleStatements: true,
  host: 'remotemysql.com',
  user: 'byMWsNlDww',
  password: 'PLJiPdPZ32',
  database: 'byMWsNlDww',
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