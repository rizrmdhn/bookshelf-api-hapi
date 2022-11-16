const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'books',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Mysql terkoneksi');
});

module.exports = connection;