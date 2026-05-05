const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User'); // Import User for the reference

const Request = sequelize.define('Request',{
    userId:{
        type:DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type: DataTypes.STRING(100),
        allowNull:false
    },
    district:{
        type: DataTypes.STRING(100),
        allowNull:false
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status:{
        type:DataTypes.ENUM('pending','approved','rejected'),
        defaultValue:'pending'
    }
},{timestamps:true,
    indexes:[
        {fields:['name']},
        {fields:['location'],
            using:'gist'
        }
    ]
});

module.exports = Request;