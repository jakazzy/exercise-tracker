import  { Sequelize, Model, DataTypes } from 'sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');
import { User } from './../../users/models/User'

class Exercise extends Model {}
Exercise.init({
  description: DataTypes.TEXT,
  duration: DataTypes.INTEGER
});

Exercise.belongsTo(User)