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

// {
// 	"username": "deborah",
// 	"email": "dompe@gmail.com",
// 	"phonenumber": "+233556878087",
// 	"goal": 255,
//   "reminder": true,
// 	"createdAt": "25-11-19",
// 	"updatedAt": "26-12-2020"
// }