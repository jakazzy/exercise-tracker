import  { Sequelize, Model, DataTypes } from 'sequelize';
// const { Sequelize, Model, DataTypes } = require('sequelize');


class User extends Model {}
User.init({
  username:{ 
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Please enter your name'
      }
    }
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isEmail: true,
      notNull: {
        msg: 'Please enter your email'
      }
    }
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  goal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reminder: {type: DataTypes.BOOLEAN,
  allowNull: true}
});


    