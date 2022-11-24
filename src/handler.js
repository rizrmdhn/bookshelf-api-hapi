const { nanoid } = require("nanoid");
const connection = require("./dbconfig");
const { getBooksFromDB } = require("./getBookFromDB");


const CheckApi = (request, h) => {

    const response = h.response({
        status: 'success',
        message: 'Api Sedang berjalan',
    });
    response.code(200);
    return response;
};

const GetBookModule = async (request, h) => {

    const { name, reading, finished } = request.query;


    let data = await getBooksFromDB();

    if (data.length > 0) {

        if (name !== undefined) {
            data = data.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (reading !== undefined) {
            data = data.filter((book) => book.reading === `${!!Number(reading)}`);
        }

        if (finished !== undefined) {
            data = data.filter((book) => book.finished === `${!!Number(finished)}`);

        }

        const response = h.response({
            status: 'success',
            data: {
                books: data.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                    reading: book.reading,
                    finished: book.finished,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt,
                })),
            },
        });
        response.code(200);
        return response;

    } else {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }


};

const AddBookModule = async (request, h) => {

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;


    if (!name) {
        const response = h.response({
            status: 'failed',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    /* This is a validation for the readPage and pageCount. If the readPage is greater than pageCount, the
    server will return a response with status fail and message. */
    if (readPage > pageCount) {
        const response = h.response({
            status: 'failed',
            message: 'Gagal menambahkan buku. Halaman yang dibaca tidak boleh lebih besar dari total halaman buku',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;


    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO booksitem (id,name,year,author,summary,publisher,pageCount,readPage,finished,reading,insertedAt,updatedAt) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
            [id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt],
            function (error, results, fields) {
                if (error) console.log(error);

                let view = async () => {
                    const books = await getBooksFromDB();
                    const isSuccess = books.filter((book) => book.id === id).length > 0;

                    if (isSuccess) {
                        const response = h.response({
                            status: 'success',
                            message: 'Buku berhasil ditambahkan',
                            data: {
                                bookId: id,
                            },
                        });
                        response.code(201);
                        return response;
                    }
                    const response = h.response({
                        status: 'failed',
                        message: 'Buku gagal ditambahkan',
                    });
                    response.code(500);
                    return response;

                }

                return resolve(view());
            });

    });
}

const GetBookByIdModule = async (request, h) => {

    const { id } = request.params;

    return new Promise((resolve, reject) => {
        connection.query(`SELECT  id, name, year, author, summary, publisher, pageCount, readPage, IF(finished, 'true', 'false')finished, IF(reading, 'true', 'false')reading, insertedAt, updatedAt FROM booksitem WHERE id = ?`, [id],
            function (error, results, fields) {
                if (error) throw error;
                const books = results;
                let view = () => {
                    const book = books.filter((n) => n.id === id)[0];
                    if (typeof book !== 'undefined') {
                        const response = h.response({
                            status: 'success',
                            data: {
                                book,
                            },
                        });
                        response.code(200);
                        return response;
                    }
                    const response = h.response({
                        status: 'failed',
                        message: 'Buku tidak ditemukan',
                    });
                    response.code(404);
                    return response;
                }
                return resolve(view())
            });
    })
};

const EditBookByIdModule = async (request, h) => {

    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const finished = (pageCount === readPage);
    const updatedAt = new Date().toISOString();

    /* This is a validation for the name. If the name is empty, the server will return a response with
    status fail and message. */
    if (!name) {
        const response = h.response({
            status: 'failed',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }


    /* This is a validation for the readPage and pageCount. If the readPage is greater than pageCount,
    the server will return a response with status fail and message. */
    if (readPage > pageCount) {
        const response = h.response({
            status: 'failed',
            message: 'Gagal memperbarui buku. Halaman yang dibaca tidak boleh lebih besar dari Total Halaman buku',
        });
        response.code(400);
        return response;
    }


    return new Promise((resolve, reject) => {
        connection.query('UPDATE booksitem SET name=?,year=?,author=?,summary=?,publisher=?,pageCount=?,readPage=?,finished=?,reading=?,updatedAt=? WHERE id=?',
            [name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt, id],
            function (error, results, fields) {
                if (error) throw error;

                let view = async () => {
                    const books = await getBooksFromDB();

                    /* Finding the index of the book with the id that is passed in the request. */
                    const index = books.findIndex((book) => book.id === id);


                    /* This is a validation for the book. If the book is found, the server will return a
                    response with status success and message. */
                    if (index !== -1) {
                        books[index] = {
                            ...books[index],
                            name,
                            year,
                            author,
                            summary,
                            publisher,
                            pageCount,
                            readPage,
                            reading,
                            updatedAt,
                        };

                        const response = h.response({
                            status: 'success',
                            message: 'Buku berhasil diperbarui',
                        });
                        response.code(200);
                        return response;
                    }

                    /* This is a response for the server when the book is not found. */
                    const response = h.response({
                        status: 'failed',
                        message: 'Gagal memperbarui buku. Id tidak ditemukan',
                    });
                    response.code(404);
                    return response;
                }

                return resolve(view());
            });

    });

};


const DeleteBookByIdModule = async (request, h) => {

    const { id } = request.params;
    const books = await getBooksFromDB();


    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM booksitem WHERE id=?', [id], function (error, results, fields) {
            if (error) console.log(error);

            let view = async () => {

                const index = books.findIndex((book) => book.id === id);

                if (index !== -1) {
                    books.splice(index, 1);
                    const response = h.response({
                        status: 'success',
                        message: 'Buku berhasil dihapus',
                    });
                    response.code(200);
                    return response;
                }

                const response = h.response({
                    status: 'failed',
                    message: 'Buku gagal dihapus. Id tidak ditemukan',
                });
                response.code(404);
                return response;
            }

            return resolve(view());
        });

    });

};

module.exports = {
    GetBookModule,
    AddBookModule,
    GetBookByIdModule,
    EditBookByIdModule,
    DeleteBookByIdModule,
    CheckApi,
};