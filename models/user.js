'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
     firstName: DataTypes.STRING,
     lastName: DataTypes.STRING,
     email: DataTypes.STRING,
     password: DataTypes.STRING,
     roleId: DataTypes.INTEGER
    },
    {
      tableName: 'users',
      timestamps: true
    }
  )
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role'})
  };
  return User
};
