const sequelize=require("../config/database");
const User = require("./User");
const PG = require("./PG");
const College = require("./College");
const UserUnlockedPGs = require("./UserUnlockedPGs")
const Payment =require("./Payment");



const initDB = async()=>{
    try{
        await sequelize.authenticate()
        console.log("Database connected ✅")

        await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        await sequelize.sync({ alter: true });
        console.log("Models synced ✅")
    }catch(err){
        console.error("DB error ❌",err)
    }
}

module.exports = {initDB,User,PG,College,UserUnlockedPGs,Payment}