import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { initModels as models } from '.'
import { transporter } from '../config/sendEmail'

export default (sequelize, Model, DataTypes, Exercise = 'Exercise') => {
  class User extends Model {

    static async authenticate(plainTextPassword, hash){
      return await bcrypt.compare(plainTextPassword, hash)
    }
    
    static async generatePasswords(plainTextPassword){
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds)
      return await bcrypt.hash(plainTextPassword, salt)
    }
    
    static async generateJWT(user, expiryPeriod = '1d'){
      return jwt.sign(user, 
        config.dev.jwt.secret, 
        {expiresIn: `${expiryPeriod}`})
    }

    static async confirmEmail(email, username, token){

      // Generate confirmation url
      const url = `http://localhost:8080/api/v1/confirmation/${token}`
      const mailOptions = {
        from: 'people international',
        to: email,
        subject: 'Confirm Email',
        html: `Hello ${username},
         <a href="${url}">click this link to activate account</a>`,
      }
       
 
      // send email
      transporter.sendMail(mailOptions)
        .then(data => { console.log('email sent successfully'); return data })
        .catch(err => err)
    }

    static async generatePasswordResetToken(hash, id, createdAt){
      const secret = `${hash}-${createdAt}`
      
      const payload = {userId: id}
      return jwt.sign({payload}, secret, {
        expiresIn: '1h',
      })
    }

    static async resetPasswordMessage(id, email, username, token){
      const url = `http://localhost:8080/api/v1/resetnewpassword/${id}/${token}`
      const mailOptions = {
        from: '',
        to: email,
        subject: 'Reset Password',
        html: `Hello ${username},
        <a href="${url}"> click on this link to reset password. </a>
        Note that this linik is inactive after a day`,
      }
      transporter.sendMail(mailOptions)
        .then(data => { console.log('email sent successfully'); return data; })
        .catch(err => {
          console.log(err);
        })
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
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    goal: DataTypes.INTEGER,
    reminder: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: 'User',
  }
  );

  
  User.hasMany(models.Exercise, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',  
    foreignKey: {
      name: 'UserId',
      allowNull: false,
    }, 
  });
  models.Exercise.belongsTo(User)

  return User

}


// Reference: Stackoverflow
// https://stackoverflow.com/questions/19605150/regex-for-
// password-must-contain-at-least-eight-characters-at-least-one-number-a
// Minimum eight characters, at least one uppercase letter,
// one lowercase letter, one number and one special character:
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
