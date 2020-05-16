import { Router } from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import { User } from '../../../../models/user-model/User'
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

function generateJWT(user){
  return jwt.sign(user.toJSON(), config.dev.jwt.secret)
}

export function requireAuth(req, res, next){
  if (!req.headers || !req.headers.authorization){
    res.status(401).send({message: 'No authorization headers'})
  }
  const token_bearer = req.headers.authorization.split('')
  if (token_bearer.length !== 2){
    res.status(402).send({ messade: 'Malformed token'})
  }

  const token = token_bearer[1]
  return jwt.verify(token, config.dev.jwt.secret, (err, decoded) => {
    if (err){
      return res.status(500)
        .send({auth: false, message: 'Failed to authenticate'})
    }
    return next()
  })

}

router.get('/verification', requireAuth, async(req, res) => {
  return res.status(200).send({ auth: true, message: 'Authenticated'})
})

// Register new users
router.post('/', async(req, res) => {

  try {
    const username = req.body.username;
    const email = req.body.email;
    const hashedpassword = req.body.hashedpassword;
    const phonenumber = req.body.phonenumber;
    const goal = req.body.goal;
    const reminder = req.body.reminder;

    const user = await User.findByPk(email);
    const password = await generatePasswords(hashedpassword)

    if (!username){
      return res.status(422)
        .send({auth: false, message: 'Username is required'});
    }
    if (!email){
      return res.status(422).send({auth: false, message: 'Email is required'});
    }
    if (!hashedpassword){
      return res.status(422)
        .send({auth: false, message: 'Password is required'});
    }

    if (user){
      return res.status(422).send({auth: false, message: 'User already exist'});
    }

    const newUser = new User({

      username: username,
      email: email,
      hashedpassword: password,
      phonenumber: phonenumber,
      goal: goal,
      reminder: reminder,
    });
    let savedUser = await newUser.save();
    const jwt = generateJWT(savedUser)
    return res.status(201).send({ token: jwt, user: savedUser});
  } catch (e){
    console.log('are you the error', e);
    throw e;
  }
});

console.log(comparePasswords, jwt, check, validationResult,
  generatePasswords, config)

// login new users
router.post('/login', async(req, res) => {
  console.log(req, res)
  const email = req.body.email
  const hashedpassword = req.body.hashedpassword

  if (!email){
    res.status(400).send({ auth: false, message: 'email is required'})
  }

  if (!hashedpassword){
    res.status(400).send({auth: false, message: 'password is required'})
  }

  const user = await User.findByPk(email)
  if (!user){
    res.status(401).send({ auth: false, message: 'unauthorized'})
  }

  const authValid = await comparePasswords(hashedpassword, user.hashedpassword)

  if (!authValid){
    res.status(401).send({ auth: false, message: 'unauthorized'})
  }

  const jwt = generateJWT(user)
  res.status(200).send({ token: jwt, auth: false, user: user})
})

export const AuthRouter = router
