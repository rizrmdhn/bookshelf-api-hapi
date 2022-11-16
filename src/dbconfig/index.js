const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'ec2-54-147-36-107.compute-1.amazonaws.com',
    user: 'apanrrqkhxsiwt',
    password: '3528f2ab6996bcea28b785a457ea81f4e446e5b64fb867486e17ea8a52939717',
    database: 'daav29qp7vd1d6',
    port: '5432',
    URL: 'postgres://apanrrqkhxsiwt:3528f2ab6996bcea28b785a457ea81f4e446e5b64fb867486e17ea8a52939717@ec2-54-147-36-107.compute-1.amazonaws.com:5432/daav29qp7vd1d6',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Mysql terkoneksi');
});

module.exports = connection;
