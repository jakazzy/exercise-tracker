import { Router } from 'express';
import users from './../../users/controllers/users'
import exercises from './../controllers/exercises'

const router = Router();

router.post('/', exercises.create);

router.get('/', users.requireAuth, exercises.getAll);


export const ExerciseRouter = router;
