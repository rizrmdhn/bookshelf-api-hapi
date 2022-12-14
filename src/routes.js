const { 
    GetBookModule,
    AddBookModule,
    GetBookByIdModule,
    EditBookByIdModule,
    DeleteBookByIdModule, 
    CheckApi,
} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: AddBookModule,
    },
    {
        method: 'GET',
        path: '/books',
        handler: GetBookModule,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: GetBookByIdModule,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: EditBookByIdModule,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: DeleteBookByIdModule,
    },
    {
        method: 'GET',
        path: '/',
        handler: CheckApi,
    },
];

module.exports = routes;