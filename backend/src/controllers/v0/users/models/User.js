import  { Sequelize, Model, DataTypes } from 'sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');


class User extends Model {}
User.init({
  username: DataTypes.STRING,
  email: DataTypes.TEXT,
  phonenumber: DataTypes.STRING,
  goal: DataTypes.INTEGER,
  reminder: DataTypes.BOOLEAN
});

