const SCHEMAS = require("../../constants").SCHEMA_TYPES;

const Patron = (sequelize, DataTypes) =>
    sequelize.define(SCHEMAS.PATRONS, {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        library_id: { type: DataTypes.STRING, allowNull: false },
        zip_code: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        timestamps: false
    });
module.exports = Patron;