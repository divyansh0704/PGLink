const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User",{
    name:DataTypes.STRING,
    email:{
        type:DataTypes.STRING,
        unique:true
    },
    password:DataTypes.STRING,
    role:{
        type:DataTypes.STRING,
        defaultValue:"viewer"
    },
    isSubscribed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }

},{timestamps:true});

module.exports = User;