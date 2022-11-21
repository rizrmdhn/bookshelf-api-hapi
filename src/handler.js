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

    const { name } = request.query;



    let data = await getBooksFromDB();

    if (data.length > 0) {

        if (name !== undefined) {
            data = data.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
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

    const { name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;


    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

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
                        status: 'fail',
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
                        status: 'fail',
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

    const { name, year, author, summary, publisher, pageCount, readPage, reading, finished } = request.payload;
    const updatedAt = new Date().toISOString();


    return new Promise((resolve, reject) => {
        connection.query('UPDATE booksitem SET name=?,year=?,author=?,summary=?,publisher=?,pageCount=?,readPage=?,finished=?,reading=?,updatedAt=? WHERE id=?',
            [name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt, id],
            function (error, results, fields) {
                if (error) throw error;

                let view = async () => {
                    const books = await getBooksFromDB();
                    const index = books.findIndex((book) => book.id === id);
                    if (!name) {
                        const response = h.response({
                            status: 'fail',
                            message: 'Gagal memperbarui buku. Mohon isi nama buku',
                        });
                        response.code(400);
                        return response;
                    }

                    if (readPage > pageCount) {
                        const response = h.response({
                            status: 'fail',
                            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                        });
                        response.code(400);
                        return response;
                    }

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
                        status: 'fail',
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
        connection.query('DELETE FROM booksitem WHERE id=?', [id],
            function (error, results, fields) {
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
                        status: 'fail',
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