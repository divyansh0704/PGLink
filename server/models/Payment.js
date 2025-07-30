const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: DataTypes.INTEGER, // stored in paise
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // 'pending', 'success', 'failed'
  },
  type: {
    type: DataTypes.STRING, // 'single' or 'subscription'
    allowNull: false
  },
  pgId: {
    type: DataTypes.INTEGER,
    allowNull: true // Only needed if 'single'
  }
}, { timestamps: true });

Payment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Payment;
