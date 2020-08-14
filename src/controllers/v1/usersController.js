import * as jwt from 'jsonwebtoken';
import crypto from 'crypto-random-string';

import { initModels as model } from '../../models';
import { config } from './../../config/config';
import { checkValidity } from '../../lib/errors';

const con = config.dev;
export default {
  // authentication
  create: async (req, res) => {
    try {
      const {
        username,
        email,
        hashedpassword,
        phonenumber,
        goal,
        reminder,
      } = req.body;
      const errors = [];

      if (!email) {
        errors.push('email cannot be empty');
      }

      if (!hashedpassword) {
        errors.push('Password cannot be empty');
      }

      if (errors.length) {
        return checkValidity(errors);
      }

      const user = await model.User.findOne({ email });
      const password = await model.User.generatePasswords(hashedpassword);

      if (user && user.email === req.body.email) {
        return res
          .status(422)
          .send({ auth: false, message: 'User already exist' });
      }
      const secretToken = crypto({ length: 10 });
      const newUser = new model.User({
        username,
        email,
        hashedpassword: password,
        phonenumber,
        goal,
        reminder,
        secretToken,
      });

      const savedUser = await newUser.save();
      const payload = { id: savedUser.id };
      const jwt = await model.User.generateJWT(payload);
      // confirm email
      await model.User.confirmEmail(savedUser, secretToken);

      return res.status(201).send({
        token: jwt,
        message: 'sign up successful. Activate account in email',
      });
    } catch (e) {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      return res.status(400).send({ message: e.message });
    }
  },

  login: async (req, res) => {
    try {
      const email = req.body.email;
      const hashedpassword = req.body.hashedpassword;
      const errors = [];

      if (!email) {
        errors.push({ message: 'email cannot be empty' });
      }

      if (!hashedpassword) {
        errors.push({ message: 'password cannot be empty' });
      }

      if (errors && errors.length) {
        return res.status(422).json(errors);
      }

      const user = await model.User.findOne({ email });

      if (!user) {
        return res.status(401).send({ auth: false, message: 'unauthorized' });
      }

      if (!user.confirmed) {
        return res.status(422).send({
          auth: false,
          message: 'Confirm your email to login',
        });
      }

      const authValid = await model.User.authenticate(
        hashedpassword,
        user.hashedpassword
      );

      if (!authValid) {
        return res.status(401).send({ auth: false, message: 'unauthorized' });
      }
      const token = await model.User.generateJWT({ id: user.id });

      res.status(200).send({ token, auth: true, user });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  confirm: async (req, res) => {
    try {
      const secretToken = req.body;
      const user = await model.User.findOne({ secretToken });
      const expDate =
        new Date(user.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000;
      const currDate = new Date().getTime();
      if (user && user.confirmed) {
        return res.status(202).send({
          message: 'User has already been activated',
          confirmed: true,
        });
      }
      if (currDate > expDate) {
        return res.status(404).send({
          message:
            'Token expired. Resend email to receive activation instructions',
          confirmed: false,
        });
      }
      if (!user) {
        return res.status(404).send({
          message:
            'Token is incorrect.' +
            ' Resend email to receive activation instructions',
          confirmed: false,
        });
      }

      await model.User.update(
        { confirmed: true, secretToken: '' },
        { where: { id: user.id } }
      );

      res
        .status(200)
        .send({ message: ' User has been activated', confirmed: true });
    } catch (e) {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }

      return res
        .status(403)
        .send({ message: `verification failed : ${e.message}` });
    }
  },

  // user's actions
  index: async (req, res) => {
    try {
      const users = await model.User.findAll();
      res.status(200).send({ users });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await model.User.findOne({
        where: { id },
        include: [{ model: model.Exercise }],
        order: [['id', 'DESC']],
      });

      if (!user) {
        return res.status(404).send({ message: 'user not found' });
      }

      res.status(200).send({ user });
    } catch (e) {
      return res.status(400).send({ message: e.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).send({ message: 'user not found' });
      }

      await model.User.update(req.body, { where: { id } });
      res.status(200).send({ message: 'user updated successfully' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).send({ message: 'user not found' });
      }

      await model.User.destroy({ where: { id } });
      res.status(200).send({ message: 'user deleted successfully' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(422).send({
          message: 'email cannot be empty',
        });
      }

      const user = await model.User.findOne({ email });

      if (!user) {
        return res.status(404).send({
          message: 'user does not exist',
        });
      }

      const token = crypto({ length: 10 });

      await model.User.resetPasswordMessage(email, user, token);

      res.status(200).send({
        message: 'Follow instructions to change password in email',
      });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  resetNewPassword: async (req, res) => {
    try {
      const { userid, token } = req.params;
      const user = await model.User.findByPk(userid);
      const secret = `${user.hashedpassword}-${user.createdAt}`;
      const { payload } = jwt.verify(token, secret);
      const id = parseInt(payload.userId, 10);

      if (!req.body.hashedpassword) {
        return res.status(422).send({ message: 'password cannot be empty' });
      }

      if (user.id === id) {
        const hash = await model.User.generatePasswords(
          req.body.hashedpassword
        );
        await model.User.update({ hashedpassword: hash }, { where: { id } });
        return res.status(200).redirect(`${con.baseurl}/login`);
      }
      return res.status(401).send({ message: 'unauthorised' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  resendactivation: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(422).send({
          message: 'email cannot be empty',
        });
      }

      const user = await model.User.findOne({ email });

      if (!user) {
        return res.status(404).send({
          message: 'user does not exist',
        });
      }
      const secretToken = crypto({ length: 10 });
      await model.User.update({ secretToken }, { where: { id: user.id } });
      const payload = { id: user.id };
      const jwt = await model.User.generateJWT(payload);
      // confirm email
      await model.User.confirmEmail(user, secretToken);

      return res.status(201).send({
        token: jwt,
        message: 'Account Activation insstructions sent to email',
      });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  // OAuth
  googleOAuth: async (req, res) => {
    try {
      const payload = { id: req.user.id };
      const token = await model.User.generateJWT(payload);
      res.cookie('access_token', token, { httpOnly: true });
      return res
        .status(200)
        .send({ message: 'user authentication successful' });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },

  facebookOAuth: async (req, res) => {
    const payload = { id: req.user.id };
    const token = await model.User.generateJWT(payload);
    res.cookie('access_token', token, { httpOnly: true });
    return res.status(200).send({ message: 'user authentication successful' });
    // return res.status(200).send(token).redirect('/')
  },
};
// ref for reset passwor
// https://ahrjarrett.com/posts/
// 2019-02-08-resetting-user-passwords-with-node-and-jwt
