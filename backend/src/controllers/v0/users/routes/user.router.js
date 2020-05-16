import { Router } from 'express';
import { User } from '../../../../models/user-model/User';
import { AuthRouter } from './auth.router'

const router = Router();

router.use('/auth', AuthRouter)
// router.get('/', async(req, res)=>{})
router.get('/:id', async(req, res) => {
  let { id } = req.params;
  const item = await User.findByPk(id);
  return res.status(200).send(item);
});

export const UserRouter = router;
