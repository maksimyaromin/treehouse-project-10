const { BookSchema, LoanSchema } = require("../database");

class Book {
    constructor({ title, author, genre, first_published = null, id = 0 }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.first_published = first_published;
        this.link = `/books/${this.id}`;
    }
};

const BookColumns = [
    {
        displayName: "Title",
        field: "title",
        type: "link"
    },
    {
        displayName: "Author",
        field: "author",
        type: "string"
    },
    {
        displayName: "Genre",
        field: "genre",
        type: "string"
    },
    {
        displayName: "Year Released",
        field: "first_published",
        type: "number",
        fixed: 0
    }
];

const checkType = book => {
    if(book instanceof Book) {
        return;
    }
    throw new TypeError("Book");
};

const add = book => {
    checkType(book);
    const build = BookSchema.build({
        title: book.title,
        author: book.author,
        genre: book.genre,
        first_published: book.first_published
    });
    return build.save().then(bookDTO => new Book(bookDTO));
};

const findById = bookId =>
    BookSchema.findById(bookId)
        .then(bookDTO => bookDTO 
            ? new Book(bookDTO) : null);

const find = ({ where = null, limit = null, offset = null }) => 
    BookSchema.findAll({
        where, limit, offset
    })
    .then(books => books 
        ? books.map(bookDTO => new Book(bookDTO)) : []);
    
const page = ({ where = null, limit = 10, offset = 0, includeWhere = null }) =>
        BookSchema.findAndCountAll({
            where, limit, offset,
            include: [
                {
                    model: LoanSchema,
                    as: "Loans",
                    where: includeWhere
                }
            ]
        })
        .then(result => {
            if(result.count) {
                return {
                    total: result.count,
                    books: result.rows.map(bookDTO => new Book(bookDTO))
                };
            }
            return { total: 0, books: [] };
        });

const remove = bookId => 
    BookSchema.destroy({
        where: {
            id: bookId
        }
    })
    .then(() => ({ success: true }))
    .catch(err => ({ success: false, message: err }));

const update = (bookId, book) => {
    checkType(book);
    return BookSchema.findById(bookId)
        .then(bookDTO => {
            return bookDTO.update({ ...book })
                .then(bookDTO => new Book(bookDTO));
        });
};

module.exports = {
    Book,
    BookAPI: {
        add,
        findById,
        find,
        remove,
        update,
        page
    },
    BookColumns
};