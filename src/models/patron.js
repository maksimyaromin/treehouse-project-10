const { PatronSchema } = require("../database");

class Patron {
    constructor({ id, first_name, last_name, address, email, library_id, zip_code }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.address = address;
        this.email = email;
        this.library_id = library_id;
        this.zip_code = zip_code;
    }
    get full_name() {
        return `${this.first_name} ${this.last_name}`;
    }
};

const checkType = patron => {
    if(patron instanceof Patron) {
        return;
    }
    throw new TypeError("Patron");
};

const findById = patronId =>
    PatronSchema.findById(patronId)
            .then(patronDTO => patronDTO 
                ? new Patron(patronDTO) : null);

const find = ({ where = null, limit = null, offset = null }) => 
    PatronSchema.findAll({
            where, limit, offset
        })
        .then(patrons => patrons 
            ? patrons.map(patronDTO => new Loan(patronDTO)) : []);

module.exports = {
    Patron,
    PatronAPI: {
        findById,
        find
    }
};