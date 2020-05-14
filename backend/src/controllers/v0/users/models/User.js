import { Model, DataTypes } from 'sequelize';
import { Exercise } from '../../exercises/models/Exercise';
import {sequelize} from './../../../../sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');


export class User extends Model {}
User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Please enter your name',
      },
    },
  },
  email: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notNull: {
        msg: 'Please enter your email',
      },
    },
  },

  hashedpassword: {
    type: DataTypes.STRING(64),
    allowNull: false,
    is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/},

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

// Reference: Stackoverflow
// https://stackoverflow.com/questions/19605150/regex-for-
// password-must-contain-at-least-eight-characters-at-least-one-number-a
// Minimum eight characters, at least one uppercase letter,
// one lowercase letter, one number and one special character:
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
