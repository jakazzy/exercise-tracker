import {initModels as model} from '../../models'


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
  
      const user = await model.User.findAll({
        where: {email: email}})
      const password = await model.User.generatePasswords(hashedpassword)
  
      if (!username){
        return res.status(422)
          .send({auth: false, message: 'Username is required'});
      }
      if (!email){
        return res.status(422)
          .send({auth: false, message: 'Email is required'});
      }
      if (!hashedpassword){
        return res.status(422)
          .send({auth: false, message: 'Password is required'});
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

      res.status(201).send({ token: jwt, user: savedUser});
    } catch (e){
      res.status(500).send({message: e.message})
    
    } 
  },

  login: async(req, res) => {
    const email = req.body.email
    const hashedpassword = req.body.hashedpassword
  
    if (!email){
      res.status(400).send({ auth: false, message: 'email is required'})
    }
  
    if (!hashedpassword){
      res.status(400).send({auth: false, message: 'password is required'})
    }
  
    const user = await model.User.findAll({
      where: {email: email}})
    if (!user){
      res.status(401).send({ auth: false, message: 'unauthorized'})
    }
    const pwd = user.hashedpassword
    const authValid = await model.User.authenticate(hashedpassword, pwd)
  
    if (!authValid){
      res.status(401).send({ auth: false, message: 'unauthorized'})
    }
  
    const jwt = model.User.generateJWT(user)
    res.status(200).send({ token: jwt, auth: false, user: user})
  },

  resetPassword: () => {},

  // user's actions
  index: async(req, res) => {
    try {
      const users = await model.User.findAll()
      res.status(200).json(users)
    } catch (error) {
      res.status(400).send({message: error.message})
    }
    

  },

  show: async(req, res) => {},

  update: async(req, res) => {},

  delete: async(req, res) => {},

  
}

