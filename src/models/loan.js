const { LoanSchema } = require("../database");
const moment = require("moment");
const Book = require("./book").Book;
const Patron = require("./patron").Patron;

class Loan {
    constructor({ id, book_id, patron_id, loaned_on, return_by, returned_on }) {
        this.id = id;
        this.book_id = book_id;
        this.patron_id = patron_id;
        this.loaned_on = moment(loaned_on);
        this.return_by = moment(return_by);
        this.returned_on = returned_on
            ? moment(returned_on) : null;
    }
    get book() {
        return getBook(this.id);
    }
    get patron() {
        return getPatron(this.id);
    }
};

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
        where, limit, offset
    })
    .then(loans => loans 
        ? loans.map(loanDTO => new Loan(loanDTO)) : []);

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
        getPatron
    }
};