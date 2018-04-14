const SCHEMAS = require("../../constants").SCHEMA_TYPES;

const Loan = (sequelize, DataTypes) => 
    sequelize.define(SCHEMAS.LOANS, {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        book_id: { type: DataTypes.INTEGER, allowNull: false },
        patron_id: { type: DataTypes.INTEGER, allowNull: false },
        loaned_on: { type: DataTypes.DATE, allowNull: false },
        return_by: { type: DataTypes.DATE, allowNull: false },
        returned_on: { type: DataTypes.DATE }
    }, {
        timestamps: false
    });
module.exports = Loan;