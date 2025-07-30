const {Sequelize}=require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URL,  {
   
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for Neon + Render
        },
    },
    logging: false,

})

module.exports = sequelize;