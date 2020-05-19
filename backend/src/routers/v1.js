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
    '/users/:id/exercises/:exerciseId', 
    requireAuth, 
    v1.exercisesController.show)

  router.put(
    '/users/:id/exercises/:exerciseId', 
    requireAuth, 
    v1.exercisesController.update)

  router.delete(
    '/users/:id/exercises/:exerciseId', 
    requireAuth, 
    v1.exercisesController.destroy)

  // Auth routes
  router.post('/signup', v1.usersController.create);
  router.post('/login', v1.usersController.login)

  // Users routes
  router.get('/users', v1.usersController.index)
  router.get('/users/:id', v1.usersController.show)
  router.put('/users/:id', v1.usersController.update)
  router.delete('/users/:id', v1.usersController.delete)

  return router

}
