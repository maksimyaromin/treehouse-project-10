const router = require("express").Router();
const serialize = require("serialize-javascript");
const {
    Book: { BookAPI, BookColumns },
    Patron: { PatronAPI, PatronColumns },
    Loan: { LoanAPI, LoanColumns }
} = require("../models");

module.exports = () => {
    router.get("/", (req, res) => {
        res.render("index", {
            title: "Library Manager"
        });
    });

    router.get("/books", (req, res) => {
        const page = req.query.page || 1;
        BookAPI.page({ offset: (page - 1) * 10 })
            .then(result => {
                res.render("books", {
                    title: "Books | Library Manager",
                    books: serialize(result.books),
                    total: result.total,
                    columns: serialize(BookColumns),
                    page
                });
            });
    });

    router.get("/books/:id", (req, res) => {
        const bookId = req.params.id;
        BookAPI.findById(bookId)
            .then(book => {
                res.render("book", {
                    title: `${book.title} | Library Manager`,
                    page: "books",
                    title: book.title,
                    book
                });
            });
    });

    router.get("/patrons", (req, res) => {
        const page = req.query.page || 1;
        PatronAPI.page({ offset: (page - 1) * 10 })
            .then(result => {
                res.render("patrons", {
                    title: "Patrons | Library Manager",
                    patrons: serialize(result.patrons),
                    total: result.total,
                    columns: serialize(PatronColumns),
                    page
                });
            });
    });

    router.get("/loans", (req, res) => {
        const page = req.query.page || 1;
        LoanAPI.page({ offset: (page - 1) * 10 })
            .then(result => {
                res.render("loans", {
                    title: "Loans | Library Manager",
                    loans: serialize(result.loans),
                    total: result.total,
                    columns: serialize(LoanColumns),
                    page
                });
            });
    });
    
    return router;
};