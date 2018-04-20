const { LoanSchema, PatronSchema, BookSchema } = require("../database");
const moment = require("moment");
const Book = require("./book").Book;
const Patron = require("./patron").Patron;

class Loan {
    constructor({ id, book_id, patron_id, loaned_on, return_by, returned_on, Book: book, Patron: patron }) {
        this.id = id;
        this.book_id = book_id;
        this.patron_id = patron_id;
        this.loaned_on = moment(loaned_on);
        this.return_by = moment(return_by);
        this.returned_on = returned_on
            ? moment(returned_on) : null;
        this.book = new Book(book);
        this.book_link = this.book.link;
        this.patron = new Patron(patron);
        this.patron_link = this.patron.link;
        this.display_loaned_on = this.loaned_on.format("YYYY-MM-DD");
        this.display_return_by = this.return_by.format("YYYY-MM-DD");
    }
};

const LoanColumns = [
    {
        displayName: "Book",
        field: "book",
        template: function(book) {
            return book.title;
        },
        type: "link",
        link: "book_link"
    },
    {
        displayName: "Patron",
        field: "patron",
        template: function(patron) {
            return patron.full_name;
        },
        type: "link",
        link: "patron_link"
    },
    {
        displayName: "Loaned on",
        field: "loaned_on",
        type: "date"
    },
    {
        displayName: "Return by",
        field: "return_by",
        type: "date"
    },
    {
        displayName: "Returned on",
        field: "returned_on",
        type: "date"
    },
    {
        displayName: "Action",
        type: "action",
        template: function(loan) {
            if(loan.returned_on) {
                return "";
            }
            return `
                <a class="list-action" href="/books/return/${loan.id}">
                    Return Book
                </a>`;
        }
    }
];

const checkType = loan => {
    if(loan instanceof Loan) {
        return;
    }
    throw new TypeError("Loan");
};

const findById = loanId =>
    LoanSchema.findById(loanId)
        .then(loanDTO => loanDTO 
            ? new Loan(loanDTO) : null);

const find = ({ where = null, limit = null, offset = null }) => 
    LoanSchema.findAll({
        where, limit, offset,
        include: [ 
            {
                model: BookSchema,
                as: "Book"
            },
            {
                model: PatronSchema,
                as: "Patron"
            } 
        ]
    })
    .then(loans => loans 
        ? loans.map(loanDTO => new Loan(loanDTO)) : []);

const findOne = where => 
    LoanSchema.findOne({ 
        where,
        include: [ 
            {
                model: BookSchema,
                as: "Book"
            },
            {
                model: PatronSchema,
                as: "Patron"
            } 
        ]
        }).then(loanDTO => loanDTO 
            ? new Loan(loanDTO) : null);

const page = ({ where = null, limit = 10, offset = 0 }) =>
    LoanSchema.findAndCountAll({
        where, limit, offset,
        include: [ 
            {
                model: BookSchema,
                as: "Book"
            },
            {
                model: PatronSchema,
                as: "Patron"
            } 
        ]
    })
    .then(result => {
        if(result.count) {
            return {
                total: result.count,
                loans: result.rows.map(loanDTO => new Loan(loanDTO))
            };
        }
        return { total: 0, loans: [] };
    });

const getBook = loanId => 
    LoanSchema.findById(loanId)
        .then(loanDTO => loanDTO ? loanDTO.getBook() : null)
        .then(bookDTO => bookDTO ? new Book(bookDTO) : null);

const getPatron = loanId => 
    LoanSchema.findById(loanId)
        .then(loanDTO => loanDTO ? loanDTO.getPatron() : null)
        .then(patronDTO => patronDTO ? new Patron(patronDTO) : null);

module.exports = {
    Loan,
    LoanAPI: {
        findById,
        find,
        getBook,
        getPatron,
        page,
        findOne
    },
    LoanColumns
};