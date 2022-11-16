const mysql = require('mysql');

const connection = mysql.createConnection({
  multipleStatements: true,
  host: 'remotemysql.com',
  user: 'byMWsNlDww',
  password: 'PLJiPdPZ32',
  database: 'byMWsNlDww',
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Mysql terkoneksi');
});

module.exports = connection;