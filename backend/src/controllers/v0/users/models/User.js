import  { Sequelize, Model, DataTypes } from 'sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');


class User extends Model {}
User.init({
  username: DataTypes.STRING,
  age: DataTypes.INTEGER,
  weight: DataTypes.FLOAT,
  height: DataTypes.FLOAT
});

