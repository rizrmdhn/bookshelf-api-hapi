const connection = require("./dbconfig");


exports.getBooksFromDB = function (request, h) {
    return new Promise ((resolve, reject) => {
    connection.query(`SELECT  id, name, year, author, summary, publisher, pageCount, readPage, IF(finished, 'true', 'false')finished, IF(reading, 'true', 'false')reading, insertedAt, updatedAt FROM booksitem`, function(error, results, fields) {
        if(error) throw error;
        let books = results;
        
        let view = () => {
            return books;
        }
        return resolve(view())
    });
    })
};