'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
     name: DataTypes.STRING
    },
    {
      tableName: 'roles',
      timestamps: true
    }
  )
  return Role
};
