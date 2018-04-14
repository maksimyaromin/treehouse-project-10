const path = require("path"),
    Sequelize = require("sequelize");

const sqliteStorage = path.join(__dirname, "..", "..", "source", "library.db");
const sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    storage: sqliteStorage,
    pool: {
        max: 20,
        acquire: 30000,
        idle: 30000
    },
    logging: false
});

sequelizeInstance.authenticate().catch(err => {
    throw err;
});

module.exports = sequelizeInstance;