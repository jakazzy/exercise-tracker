import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { config } from '../config/config'

export default (sequelize, Model, DataTypes, Exercise) => {
  class User extends Model {

    static async authenticate(plainTextPassword, hash){
      return await bcrypt.compare(plainTextPassword, hash)
    }
    
    static async generatePasswords(plainTextPassword){
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds)
      return await bcrypt.hash(plainTextPassword, salt)
    }
    
    static async generateJWT(user){
      return jwt.sign(user, config.dev.jwt.secret)
    }
    
  }
 

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
      type: DataTypes.STRING(),
      allowNull: false,
      is:
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/},

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
  return User

}


// Reference: Stackoverflow
// https://stackoverflow.com/questions/19605150/regex-for-
// password-must-contain-at-least-eight-characters-at-least-one-number-a
// Minimum eight characters, at least one uppercase letter,
// one lowercase letter, one number and one special character:
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

// {
//   "user": {
//     "username": "deborah",
//     "email": "dompe@gmail.com",
//     "phonenumber": "+233556878087",
//     "goal": 255,
//     "reminder": true,
//     "updatedAt": "2020-05-02T09:34:48.872Z",
//     "createdAt": "2020-05-02T09:34:48.872Z"
//   }
