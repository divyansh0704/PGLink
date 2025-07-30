const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const PG = require('./PG');

const UserUnlockedPGs = sequelize.define('UserUnlockedPGs', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pgId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { timestamps: true });

User.belongsToMany(PG, { through: UserUnlockedPGs, foreignKey: 'userId',as: 'pgs' });
PG.belongsToMany(User, { through: UserUnlockedPGs, foreignKey: 'pgId',as: 'users' });

module.exports = UserUnlockedPGs;
