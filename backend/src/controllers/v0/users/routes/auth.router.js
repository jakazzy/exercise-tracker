import { Router } from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import { User } from '../models/User'
import { config } from '../../../../config/config'

const router = Router()

async function comparePasswords(plainTextPassword, hash){
  return await bcrypt.compare(plainTextPassword, hash)
}

async function generatePasswords(plainTextPassword){
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(plainTextPassword, salt)
}

// Register new users
router.post('/', async(req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedpassword = req.body.hashedpassword;
  const phonenumber = req.body.phonenumber;
  const goal = req.body.goal;
  const reminder = req.body.reminder;
  if (!username){
    return res.status(422).send({auth: false, message: 'Name cannot be null'});
  }
  if (!email){
    return res.status(422).send({auth: false, message: 'Email cannot be null'});
  }
  if (!hashedpassword){
    return res.status(422)
      .send({auth: false, message: 'Password cannot be null'});
  }
  const user = await User.findByPk(email);
  if (user){
    return res.status(422).send({auth: false, message: 'User already exist'});
  }
  try {
    const newUser = new User({

      username: username,
      email: email,
      hashedpassword: hashedpassword,
      phonenumber: phonenumber,
      goal: goal,
      reminder: reminder,
    });
    let savedUser = await newUser.save();
    return res.status(201).send({ user: savedUser});
  } catch (e){
    console.log('are you the error', e);
    throw e;
  }
});

console.log(comparePasswords, jwt, check, validationResult,
  generatePasswords, config)
