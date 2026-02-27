const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: DataTypes.INTEGER, 
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' 
  },
  type: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  pgId: {
    type: DataTypes.INTEGER,
    allowNull: true 
  }
}, { timestamps: true });

Payment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Payment;
