const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const SmsSession = sequelize.define("SmsSession", {
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    step: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'INIT', 
    },
    draftData: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
});

module.exports = SmsSession;