const { Client } = require('pg');

const connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Mysql terkoneksi');
});

module.exports = connection;