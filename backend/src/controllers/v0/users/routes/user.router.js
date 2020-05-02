import { Router } from 'express'
import { User } from '../models/User'

const router = Router()

router.post('/', async(req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const goal =  req.body.goal;
    const reminder = req.body.reminder

    if( !username){
        return res.status(422).send({auth:false, message: "Username  cannot be null"})
    }
    if( !email){
        return res.status(422).send({auth:false, message: "Email  cannot be null"})
    }

    const user = await User.findByPk(username)
    if(user){
        return res.status(422).send({auth:false, message: "User may already exist"})
    }

    try{
    const newUser =  new User({
        username: username,
        age: age,
        weight: weight,
        height: height
    })
 
    let savedUser;
   
     savedUser = await newUser.save()
    }catch(e){
        console.log('are you the error', e)
        throw e
    }
 
    return res.status(201).send({ user: savedUser})
    
    })
    
router.get('/', async(req, res)=>{})
router.get('/:id', async(req, res) => {
    let { id } = req.params;
    const item = await User.findByPk(id)
    return res.status(200).send(item)
})

export const UserRouter = router