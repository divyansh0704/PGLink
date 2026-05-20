const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const College = sequelize.define('College',{
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
    location:{
        type:DataTypes.GEOMETRY('POINT'),
        allowNull:false
    }
},{timestamps:true,
    indexes:[
        {fields:['name']},
        {fields:['location'],
            using:'gist'
        }
    ]
});

module.exports = College;