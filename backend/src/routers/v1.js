import v1 from './../controllers/v1'
import {requireAuth} from './../middlewares'

export default (express) => {
  const router = express.Router()

  // exercises routes
  router.get('/users/:id/exercises', requireAuth, v1.exercisesController.index);
  
  router.post(
    '/users/:id/exercises', 
    requireAuth, 
    v1.exercisesController.create);

  router.get(
    '/users/:id/exercises/:exercisesId', 
    requireAuth, 
    v1.exercisesController.show)


  // users route  

  // Auth routes
  router.post('/signup', v1.usersController.create);
  router.post('/login', v1.usersController.login)

  return router

}
