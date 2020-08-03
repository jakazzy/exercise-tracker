import {initModels as model} from '../../models'
import * as jwt from 'jsonwebtoken'
import { config } from './../../config/config'
import { checkValidity } from '../../lib/errors'


export default {
  // authentication
  create: async(req, res) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const hashedpassword = req.body.hashedpassword;
      const phonenumber = req.body.phonenumber;
      const goal = req.body.goal;
      const reminder = req.body.reminder;
      const errors = []
      
      if (!username){
        errors.push('username cannot be empty')
      }

      if (!email){
        errors.push('email cannot be empty')
      }

      if (!hashedpassword){
        errors.push('Password cannot be empty')
      }

      if (errors.length){
        return checkValidity(errors)
      }

      const user = await model.User.findOne({email})
      const password = await model.User.generatePasswords(hashedpassword)

      if (user && user.email === req.body.email){
        return res.status(422)
          .send({auth: false, message: 'User already exist'});
      }
  
      const newUser = new model.User({
        username,
        email,
        hashedpassword: password,
        phonenumber,
        goal,
        reminder,
      });

      const savedUser = await newUser.save();
      const payload = { id: savedUser.id}
      const jwt = await model.User.generateJWT(payload)  
      // confirm email
      await model.User.confirmEmail(savedUser, jwt) 

      return res.status(201).send({ 
        token: jwt, 
        message: 'sign up successful. Activate account in email',
      }); 

    } catch (e){ 
      console.log(e, 'check this');
      
      if (e){
        return res.status(e.statusCode).send({ message: e.message})
      }
      return res.status(400).send({message: e.message})
    } 
  },

  login: async(req, res) => {
    try {
      const email = req.body.email
      const hashedpassword = req.body.hashedpassword
      const errors = []
  
      if (!email){
        errors.push({message: 'email cannot be empty'})
      } 

      if (!hashedpassword){
        errors.push({message: 'password cannot be empty'})
      }

      if (errors && errors.length){
        return res.status(422).json(errors)
      }

      const user = await model.User.findOne({email})  

      if (!user){
        return res.status(401).send({ auth: false, message: 'unauthorized'})
      }

      if (!user.confirmed){
        return res.status(422).send({
          auth: false, 
          message: 'Confirm your email to login'})
      }

      const authValid = await model.User.authenticate(
        hashedpassword, 
        user.hashedpassword
      )

      if (!authValid){
        return res.status(401).send({ auth: false, message: 'unauthorized'})
      }
      const token = await model.User.generateJWT({id: user.id})

      res.status(200).send({ token, auth: true, user})   
    } catch (error) {
      res.status(400).send({message: error.message})
    }   
  },

  confirm: async(req, res) => {
    try {
      let { id } = jwt.verify(req.params.token, config.dev.jwt.secret)
      id = parseInt(id, 10)

      if (!id){
        return res.status(404).send({message: 'user not found'})
      }

      await model.User.update({confirmed: true}, { where: { id }})

      res.status(302).redirect('http://localhost:8080/api/v1/login') 

    } catch (e) {
      if (e.statusCode){
        return res.status(e.statusCode).send({message: e.message}) 
      }

      return res.status(400).send({message: e.message})
    }
  },

  // user's actions
  index: async(req, res) => {
    try {
      const users = await model.User.findAll()
      res.status(200).send({ users })

    } catch (error) {
      res.status(400).send({message: error.message})
    }
  },

  show: async(req, res) => {
    try {
      const { id } = req.params
      const user = await model.User.findOne({ 
        where: {id}, 
        include: [{model: model.Exercise}], 
        order: [['id', 'DESC']],
      })

      if (!user){
        return res.status(404).send({message: 'user not found'})
      }

      res.status(200).send({ user })

    } catch (e) { 
      return res.status(400).send({message: e.message})
    }   
  },

  update: async(req, res) => {
    try {
      const { id } = req.params

      if (!id){
        return res.status(404).send({ message: 'user not found'})
      }

      await model.User.update(req.body, { where: { id}})
      res.status(200).send({message: 'user updated successfully'})

    } catch (e) {
      res.status(400).send({message: e.message})
    }
  },

  delete: async(req, res) => {
    try {
      const { id } = req.params

      if (!id){
        return res.status(404).send({message: 'user not found'})
      }

      await model.User.destroy({where: {id}})
      res.status(200).send({message: 'user deleted successfully'})
    } catch (e) {
     
      res.status(400).send({message: e.message})
    }
  },

  sendResetPasswordEmail: async(req, res) => {
    try {
      const { email } = req.body

      if (!email){
        return res.status(422).send({
          message: 'email cannot be empty',
        }) 
      }

      const user = await model.User.findOne({email}) 

      if (!user){
        return res.status(404).send({ 
          message: 'user does not exist',
        }) 
      }

      const token = await model.User.generatePasswordResetToken(
        user.hashedpassword, 
        user.id, 
        user.createdAt)

      await model.User.resetPasswordMessage(
        user.id, email, user, token
      )
      
      res.status(200).send({
        message: 'Follow instructions to change password in email',
      })

    } catch (e) { 
      res.status(400).send({message: e.message})
    }
  },

  resetNewPassword: async(req, res) => {
    try {
      const { userid, token } = req.params
      const user = await model.User.findByPk(userid)
      const secret = `${user.hashedpassword}-${user.createdAt}`
      const {payload } = jwt.verify(token, secret)
      const id = parseInt(payload.userId, 10)
      
      if (!req.body.hashedpassword){ 
        return res.status(422).send({message: 'password cannot be empty'})
      }  

      if (user.id === id){
        const hash = await model.User.generatePasswords(req.body.hashedpassword)
        await model.User.update({hashedpassword: hash}, { where: { id}})
        return res.status(200).redirect('http://localhost:8080/api/v1/login')
      }
      return res.status(401).send({message: 'unauthorised'})

    } catch (e) {
      res.status(400).send({message: e.message})
    }
  },
}
// ref for reset passwor
// https://ahrjarrett.com/posts/
// 2019-02-08-resetting-user-passwords-with-node-and-jwt
