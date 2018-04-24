const sequelize = require("./sequelize"),
    DataTypes = require("sequelize").DataTypes;

/* All schemas are described in a separate schemas folder */
const   Book = require("./schemas/book")(sequelize, DataTypes),
      Patron = require("./schemas/patron")(sequelize, DataTypes),
        Loan = require("./schemas/loan")(sequelize, DataTypes);

/* Establishing associations between schemes for more flexible operation of the application */
Loan.belongsTo(Book, { foreignKey: "book_id", targetKey: "id", as: "Book" });
Loan.belongsTo(Patron, { foreignKey: "patron_id", targetKey: "id", as: "Patron" });
Book.hasMany(Loan, { foreignKey: "book_id", sourceKey: "id", as: "Loans" });
Patron.hasMany(Loan, { foreignKey: "patron_id", sourceKey: "id", as: "Loans" });

module.exports = {
    sequelize,
    BookSchema: Book,
    PatronSchema: Patron,
    LoanSchema: Loan
};