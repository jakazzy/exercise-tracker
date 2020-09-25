import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import ejs from 'ejs';
import { config } from '../config/config';
// import { initModels as models } from '.'
import { transporter } from '../config/sendEmail';

export default (sequelize, Model, DataTypes, Exercise = 'Exercise') => {
  class User extends Model {
    static async authenticate(plainTextPassword, hash) {
      return await bcrypt.compare(plainTextPassword, hash);
    }

    static async generatePasswords(plainTextPassword) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(plainTextPassword, salt);
    }

    static async generateJWT(user, expiryPeriod = '1d') {
      return jwt.sign(user, config.dev.jwt.secret, {
        expiresIn: `${expiryPeriod}`,
      });
    }

    static async verifyJWT(token) {
      return await jwt.verify(token, config.dev.jwt.secret);
    }

    static async confirmEmail(user, token) {
      const url = `${config.dev.clienturl}/confirmation?token=${token}`;

      ejs.renderFile(
        __dirname + '/../mailtemplate/confirmation-instruction.ejs',
        { user, url },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            // Generate email message
            const mailOptions = {
              from: 'people international',
              to: user.email,
              subject: 'Confirm Email',
              html: data,
            };

            // send email using transporter
            transporter
              .sendMail(mailOptions)
              .then((data) => {
                console.log('email sent successfully');
                return data;
              })
              .catch((err) => console.log(err));
          }
        }
      );
    }

    static async inviteFriend(inviteData) {
      const url = `${config.dev.clienturl}/signup`;
      ejs.renderFile(
        __dirname + '/../mailtemplate/invite-friend.ejs',
        {
          inviteData,
          url,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            // Generate email message
            const mailOptions = {
              from: 'people international',
              to: inviteData.email,
              subject: `${inviteData.friend} is inviting you to join us`,
              html: data,
            };

            // send email using transporter
            transporter
              .sendMail(mailOptions)
              .then((data) => {
                console.log('email sent successfully');
                return data;
              })
              .catch((err) => console.log(err));
          }
        }
      );
    }

    static async generatePasswordResetToken(hash, id, createdAt) {
      const secret = `${hash}-${createdAt}`;

      const payload = { userId: id };
      return jwt.sign({ payload }, secret, {
        expiresIn: '1h',
      });
    }

    static async resetPasswordMessage(email, user, token) {
      const url = `${config.dev.clienturl}/password-confirm/${token}`;

      ejs.renderFile(
        __dirname + '/../mailtemplate/reset-instruction.ejs',
        { user, url },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            const mailOptions = {
              from: '',
              to: email,
              subject: 'Reset Password',
              html: data,
            };

            transporter
              .sendMail(mailOptions)
              .then((data) => {
                console.log('email sent successfully');
                return data;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: {
            msg: 'Please enter your email',
          },
        },
      },
      facebookId: DataTypes.STRING,
      facebookEmail: DataTypes.STRING,
      googleId: DataTypes.STRING,
      googleEmail: DataTypes.STRING,
      isFacebookAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
      isGoogleAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
      isLocalAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
      hashedpassword: {
        type: DataTypes.STRING(),
        // eslint-disable-next-line max-len
        is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      },

      phonenumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      secretToken: DataTypes.STRING,
      goal: DataTypes.INTEGER,
      reminder: DataTypes.BOOLEAN,
      notify: DataTypes.BOOLEAN,
      mode: DataTypes.BOOLEAN,
      remember: DataTypes.BOOLEAN,
      height: DataTypes.STRING,
      weight: DataTypes.STRING,
      age: DataTypes.STRING,
      about: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Exercise, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: {
        name: 'UserId',
        allowNull: false,
      },
    });

    // models.Exercise.belongsTo(User)
  };

  return User;
};

// Reference: Stackoverflow
// https://stackoverflow.com/questions/19605150/regex-for-
// password-must-contain-at-least-eight-characters-at-least-one-number-a
// Minimum eight characters, at least one uppercase letter,
// one lowercase letter, one number and one special character:
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
