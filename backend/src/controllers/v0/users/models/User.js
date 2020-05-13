import { Sequelize, Model, DataTypes } from 'sequelize';
import { Exercise } from '../../exercises/models/Exercise';
import {sequelize} from './../../../../sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');


export class User extends Model {}
User.init({
  username: {
    primaryKey: true,
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Please enter your name',
      },
    },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isEmail: true,
      notNull: {
        msg: 'Please enter your email',
      },
    },
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  goal: DataTypes.INTEGER,
  reminder: DataTypes.BOOLEAN,
},
{
  sequelize,
  modelName: 'User',
}
);


User.hasMany(Exercise);
