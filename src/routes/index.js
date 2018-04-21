const moment = require("moment");
const router = require("express").Router();
const serialize = require("serialize-javascript");
const Sequelize = require("sequelize");
const FILTERS = require("../constants").FILTERS;
const {
    Book: { Book: BookModel, BookAPI, BookColumns },
    Patron: { Patron: PatronModel, PatronAPI, PatronColumns },
    Loan: { Loan: LoanModel, LoanAPI, LoanColumns }
} = require("../models");
const Op = require("sequelize").Op;

module.exports = () => {
    router.get("/", (req, res) => {
        res.render("index", {
            title: "Library Manager"
        });
    });

    router.get("/books", (req, res) => {
        const page = req.query.page || 1;
        const filter = req.query.filter || null;
        const search = req.query.search || null;
        let includeWhere = null;
        let where = null;
        if(search) {
            where = {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("title")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    }),
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("author")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    }),
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("genre")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    })
                ]
            }
        }
        switch(filter) {
            case FILTERS.OVERDUE:
                includeWhere = {
                    returned_on: {
                        [Op.eq]: null
                    },
                    return_by: {
                        [Op.lt]: moment().toDate()
                    }
                };
                break;
            case FILTERS.CHECKED_OUT:
                includeWhere = {
                    returned_on: {
                        [Op.eq]: null
                    }
                };
                break;
        };
        BookAPI.page({ where, includeWhere, offset: (page - 1) * 10 })
            .then(result => {
                res.render("books", {
                    title: "Books | Library Manager",
                    books: serialize(result.books),
                    total: result.total,
                    columns: serialize(BookColumns),
                    filter,
                    page,
                    search: search || ""
                });
            });
    });

    router.post("/book/create", (req, res) => {
        const book = new BookModel(req.body);
        BookAPI.add(book)
            .then(result => {
                res.json(result);
            });
    });

    router.post("/book/update", (req, res) => {
        const book = new BookModel(req.body);
        BookAPI.update(book.id, book)
            .then(result => {
                res.json(result);
            });
    });

    router.get("/books/:id", (req, res) => {
        const bookId = req.params.id;
        if(bookId === "new") {
            return res.render("book", {
                title: "New Book | Library Manager",
                page: "books",
                title: "New Book",
                book: new BookModel({
                    id: 0, title: "", author: "", genre: ""
                })
            });
        }
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

    router.get("/books/return/:loanId", (req, res) => {
        const loanId = req.params.loanId;
        LoanAPI.findOne({ id: loanId })
            .then(loan => {
                res.render("return_book", {
                    title: "Return Books | Library Manager",
                    page: "books",
                    title: "Return Books",
                    loan
                });
            });
    });

    router.get("/patrons", (req, res) => {
        const page = req.query.page || 1;
        const search = req.query.search || null;
        let where = null;
        if(search) {
            where = {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("first_name")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    }),
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("last_name")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    }),
                    Sequelize.where(Sequelize.fn("lower", Sequelize.col("library_id")), {
                        [Op.like]: `%${search.toLowerCase()}%`
                    })
                ]
            }
        }
        PatronAPI.page({ where, offset: (page - 1) * 10 })
            .then(result => {
                res.render("patrons", {
                    title: "Patrons | Library Manager",
                    patrons: serialize(result.patrons),
                    total: result.total,
                    columns: serialize(PatronColumns),
                    page,
                    search: search || ""
                });
            });
    });

    router.post("/patron/create", (req, res) => {
        const patron = new PatronModel(req.body);
        PatronAPI.add(patron)
            .then(result => {
                res.json(result);
            });
    });

    router.post("/patron/update", (req, res) => {
        const patron = new PatronModel(req.body);
        PatronAPI.update(patron.id, patron)
            .then(result => {
                res.json(result);
            });
    });

    router.get("/patrons/:id", (req, res) => {
        const patronId = req.params.id;
        if(patronId === "new") {
            return  res.render("patron", {
                title: "New Patron | Library Manager",
                page: "patrons",
                title: "New Patron",
                patron: new PatronModel({
                    id: 0, first_name: "", last_name: "", 
                    address: "", email: "", library_id: ""
                })
            });
        }
        PatronAPI.findById(patronId)
            .then(patron => {
                res.render("patron", {
                    title: `${patron.full_name} | Library Manager`,
                    page: "patrons",
                    title: patron.full_name,
                    patron
                });
            });
    });

    router.get("/loans", (req, res) => {
        const page = req.query.page || 1;
        const filter = req.query.filter || null;
        let where = null;
        switch(filter) {
            case FILTERS.OVERDUE:
                where = {
                    returned_on: {
                        [Op.eq]: null
                    },
                    return_by: {
                        [Op.lt]: moment().toDate()
                    }
                };
                break;
            case FILTERS.CHECKED_OUT:
                where = {
                    returned_on: {
                        [Op.eq]: null
                    }
                };
                break;
        };
        LoanAPI.page({ where, offset: (page - 1) * 10 })
            .then(result => {
                res.render("loans", {
                    title: "Loans | Library Manager",
                    loans: serialize(result.loans),
                    total: result.total,
                    columns: serialize(LoanColumns),
                    filter,
                    page
                });
            });
    });

    router.post("/loan/create", (req, res) => {
        const loan = new LoanModel(req.body);
        LoanAPI.add(loan)
            .then(result => {
                res.json(result);
            });
    });

    router.post("/loan/return", (req, res) => {
        const loan = new LoanModel(req.body);
        LoanAPI.returnBook(loan.id, loan)
            .then(result => {
                res.json(result);
            });
    });

    router.get("/loans/new", (req, res) => {
        Promise.all([ BookAPI.find({}), PatronAPI.find({}) ])
            .then(([ books, patrons ]) => {
                res.render("loan", {
                    title: "New Loan | Library Manager",
                    page: "loans",
                    title: "New Loan",
                    books: books.map(book => {
                        return {
                            id: book.id,
                            name: book.title
                        };
                    }),
                    patrons: patrons.map(patron => {
                        return {
                            id: patron.id,
                            name: patron.full_name
                        };
                    })
                });
            });
    });

    router.get("/loans/book/:id", (req, res) => {
        const page = req.query.page || 1;
        const bookId = req.params.id;
        LoanAPI.page({ 
            offset: (page - 1) * 10,
            where: {
                book_id: bookId
            }
        }).then(result => {
            res.json({
                items: serialize(result.loans),
                total: result.total,
                columns: serialize(LoanColumns),
                page
            });
        });
    });

    router.get("/loans/patron/:id", (req, res) => {
        const page = req.query.page || 1;
        const patronId = req.params.id;
        LoanAPI.page({ 
            offset: (page - 1) * 10,
            where: {
                patron_id: patronId
            }
        }).then(result => {
            res.json({
                items: serialize(result.loans),
                total: result.total,
                columns: serialize(LoanColumns),
                page
            });
        });
    });
    
    return router;
};