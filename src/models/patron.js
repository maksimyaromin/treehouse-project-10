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
        this.link = `/patrons/${this.id}`;
        this.full_name = `${this.first_name} ${this.last_name}`; 
    }
};

const PatronColumns = [
    {
        displayName: "Name",
        field: "full_name",
        type: "link"
    },
    {
        displayName: "Address",
        field: "address",
        type: "string"
    },
    {
        displayName: "Email",
        field: "email",
        type: "string"
    },
    {
        displayName: "Library ID",
        field: "library_id",
        type: "string"
    },
    {
        displayName: "Zip",
        field: "zip_code",
        type: "number",
        fixed: 0
    }
];

const checkType = patron => {
    if(patron instanceof Patron) {
        return;
    }
    throw new TypeError("Patron");
};

const add = patron => {
    checkType(patron);
    const build = PatronSchema.build({
        first_name: patron.first_name,
        last_name: patron.last_name,
        address: patron.address,
        email: patron.email,
        library_id: patron.library_id,
        zip_code: patron.zip_code
    });
    return build.save().then(patronDTO => new Patron(patronDTO));
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
            ? patrons.map(patronDTO => new Patron(patronDTO)) : []);

const page = ({ where = null, limit = 10, offset = 0 }) =>
    PatronSchema.findAndCountAll({
        where, limit, offset
    })
    .then(result => {
        if(result.count) {
            return {
                total: result.count,
                patrons: result.rows.map(patronDTO => new Patron(patronDTO))
            };
        }
        return { total: 0, patrons: [] };
    });

const update = (patronId, patron) => {
    checkType(patron);
    return PatronSchema.findById(patronId)
        .then(patronDTO => {
            return patronDTO.update({ ...patron })
                .then(patronDTO => new Patron(patronDTO));
        });
};
    

module.exports = {
    Patron,
    PatronAPI: {
        add,
        findById,
        find,
        page,
        update
    },
    PatronColumns
};