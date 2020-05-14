import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

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
    return res.status(422).send({auth: false, message: 'Email cannot be null'});
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

// router.get('/', async(req, res)=>{})
router.get('/:id', async(req, res) => {
  let { id } = req.params;
  const item = await User.findByPk(id);
  return res.status(200).send(item);
});

export const UserRouter = router;
