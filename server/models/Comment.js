const sequelize = require("../config/database.js");
const { DataTypes } = require("sequelize");
const User = require("./User.js");
const PG = require("./PG.js");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000],
    },
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },

  pgId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PG,
      key: "id",
    },
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ["pgId"] },
    { fields: ["userId"] },
    { fields: ["pgId", "createdAt"] },
  ],
});

Comment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comment, { foreignKey: "userId" });

Comment.belongsTo(PG, { foreignKey: "pgId" });
PG.hasMany(Comment, { foreignKey: "pgId" });

module.exports = Comment;