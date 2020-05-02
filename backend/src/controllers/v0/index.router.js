import { Router} from 'express'
import { ExerciseRouter } from './exercises/routes/exercise.router'
import { UserRouter } from './users/routes/user.router'

const router = Router()

router.use('/exercise', ExerciseRouter)
router.use('/users', UserRouter)

router.get('/', async(req, res)=>{
    res.send('V0')
})

export const IndexRouter = router

