import {initModels as model} from '../../models'
import { transporter } from './../../config/sendEmail'
import * as jwt from 'jsonwebtoken'
import { config } from './../../config/config'
import { RecordNotFound } from '../../lib/errors'


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

      const user = await model.User.findAll({
        where: {email: email}})
      const password = await model.User.generatePasswords(hashedpassword)
  
      if (!username){
        errors.push({message: 'username cannot be empty'})
      }
      if (!email){
        errors.push({ message: ' email cannot be empty'})
      }
      if (!hashedpassword){
        errors.push({message: 'Password cannot be empty'})
      }
      if (errors.length){
        res.status(422).json(errors)
      }
      if (user && user.length){
        return res.status(422)
          .send({auth: false, message: 'User already exist'});
      }
  
      const newUser = new model.User({
  
        username: username,
        email: email,
        hashedpassword: password,
        phonenumber: phonenumber,
        goal: goal,
        reminder: reminder,
      });
      let savedUser = await newUser.save();

      const payload = { id: savedUser.id}
      const jwt = await model.User.generateJWT(payload)

      // Generate confirmation url
      const url = `http://localhost:8080/api/v1/confirmation/${jwt}`
      const mailOptions = {
        from: 'people international',
        to: email,
        subject: 'Confirm Email',
        html: `Hello ${username},
        <a href="${url}">click this link to activate account</a>`,
      }
      

      // send email
      transporter.sendMail(mailOptions)
        .then(data => console.log(data, 'launched successfully'))
    
      res.status(201).send(
        { 
          token: jwt, 
          message: 'sign up successful. Activate account in email',
        });
      
      
    } catch (e){ 
      res.status(500).send({message: e.message})
    
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
      if (errors.length){
        res.status(422).json(errors)
      }
      const user = await model.User.findAll({
        where: {email: `${email}`}})
      
        
      if (!user.length){
        res.status(401).send({ auth: false, message: 'unauthorized'})
      }
    
      if (user.confirmed){
        res.status(400).send({
          auth: false, 
          message: 'Confirm your email to login'})
      }
      const pwd = user[0].hashedpassword
      const authValid = await model.User.authenticate(hashedpassword, pwd)
  
      if (!authValid){
        res.status(401).send({ auth: false, message: 'unauthorized'})
      }
  
      const jwt = await model.User.generateJWT(user[0].id)
      res.status(200).send({ token: jwt, auth: true, user: user})
      
    } catch (error) {
      res.status(400).send({message: error.message})
    }
    
  },
  // user's actions
  index: async(req, res) => {
    try {
      const users = await model.User.findAll()
      res.status(200).send({ users})
    } catch (error) {
      res.status(400).send({message: error.message})
    }
  },

  show: async(req, res) => {
    try {
      const { id } = req.params
      const user = await model.User.findAll({
        where: {id},
        include: [{model: model.Exercise}],
      })
      if (!user){
        RecordNotFound('user not found')
      }
      res.status(200).send({user})
    } catch (e) { 
      if (e.statusCode){
        res.status(404).send({message: e.message})
      }
      res.status(400).send({message: e.message})
    }
    
  },

  update: async(req, res) => {
    try {
      const { id } = req.params
      if (!id){
        RecordNotFound('user not found')
      }
      await model.User.update(req.body, { where: { id}})
      res.status(200).send({message: 'user updated successfully'})
    } catch (e) {
      if (e.statusCode){
        res.status(e.statusCode).message({ message: e.message})
      }
      res.status(400).send({message: e.message})
    }
  },

  delete: async(req, res) => {
    try {
      const { id } = req.params
      if (!id){
        RecordNotFound('user not found')
      }
      await model.User.destroy({where: {id}})
      res.status(200).send({message: 'user deleted successfully'})
    } catch (e) {
      if (e.statusCode){
        res.status(e.statusCode).send({message: e.message})
      }
      res.status(400).send({message: e.message})
    }
  },
  confirm: async(req, res) => {
    try {
      let {id } = jwt.verify(req.params.token, config.dev.jwt.secret)
      id = parseInt(id, 10)
      
      if (!id){
        RecordNotFound('user notfound')
      }
      await model.User.update({confirmed: true}, { where: {id}})
      res.status(200).redirect('http://localhost:8080/api/v1/login')
      
    } catch (e) {
      res.status(e.statusCode).send({message: e.message})
      res.status(400).send({message: e.message})
    }
  },
}

