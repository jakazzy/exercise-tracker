import { Router } from 'express';
import { User } from '../models/User';

const router = Router();


// router.get('/', async(req, res)=>{})
router.get('/:id', async(req, res) => {
  let { id } = req.params;
  const item = await User.findByPk(id);
  return res.status(200).send(item);
});

export const UserRouter = router;
