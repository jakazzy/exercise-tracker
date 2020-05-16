import { Router } from 'express'
// import * as bcrypt from 'bcrypt'
// import * as jwt from 'jsonwebtoken'
// import {check, validationResult} from 'express-validator'
// import { User } from '../../../../models/user-model/User'
// import { config } from '../../../../config/config'
import users from './../controllers/users'

const router = Router()

// async function comparePasswords(plainTextPassword, hash){
//   return await bcrypt.compare(plainTextPassword, hash)
// }

// async function generatePasswords(plainTextPassword){
//   const saltRounds = 10;
//   const salt = await bcrypt.genSalt(saltRounds)
//   return await bcrypt.hash(plainTextPassword, salt)
// }

// function generateJWT(user){
//   return jwt.sign(user.toJSON(), config.dev.jwt.secret)
// }

// export function requireAuth(req, res, next){
//   if (!req.headers || !req.headers.authorization){
//     res.status(401).send({message: 'No authorization headers'})
//   }
//   const token_bearer = req.headers.authorization.split('')
//   if (token_bearer.length !== 2){
//     res.status(402).send({ messade: 'Malformed token'})
//   }

//   const token = token_bearer[1]
//   return jwt.verify(token, config.dev.jwt.secret, (err, decoded) => {
//     if (err){
//       return res.status(500)
//         .send({auth: false, message: 'Failed to authenticate'})
//     }
//     return next()
//   })

// }

router.get('/verification', users.requireAuth, async(req, res) => {
  return res.status(200).send({ auth: true, message: 'Authenticated'})
})

// Register new users
router.post('/', users.create);

// console.log(comparePasswords, generateJWT, jwt, check, validationResult,
//   generatePasswords, config)

// login new users
router.post('/login', users.login)

export const AuthRouter = router
