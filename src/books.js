const { getBooksFromDB } = require("./getBookFromDB");

const books = async (request, h) => {
  const data = await getBooksFromDB();
  const response = h.response({
    status: 'success',
    data: {
        books: data,
    },
  });
  console.log(data);
  response.code(200);
  return response;
};

console.log(books);
module.exports = books;