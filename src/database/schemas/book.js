const SCHEMAS = require("../../constants").SCHEMA_TYPES;

const Book = (sequelize, DataTypes) => 
    sequelize.define(SCHEMAS.BOOKS, {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        author: { type: DataTypes.STRING, allowNull: false },
        genre: { type: DataTypes.STRING, allowNull: false },
        first_published: { type: DataTypes.INTEGER }
    }, {
        timestamps: false
    });
module.exports = Book;