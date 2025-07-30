const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require('./User');

const PG = sequelize.define('PG', {
    title: DataTypes.STRING,
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    district:{
        type: DataTypes.STRING(100),

    },
    pincode:{
        type: DataTypes.STRING(10),
    },
    state:{
        type: DataTypes.STRING(100),

    },
  
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    collegeName: DataTypes.STRING,
    distanceKm: DataTypes.FLOAT,
    rent: DataTypes.FLOAT,
    amenities: DataTypes.JSON,
    imageUrl: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, { timestamps: true });


PG.belongsTo(User, { foreignKey: 'ownerId' }); 
User.hasMany(PG, { foreignKey: 'ownerId' });  

module.exports = PG;