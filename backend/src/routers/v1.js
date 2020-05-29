import v1 from './../controllers/v1'
import {requireAuth} from './../middlewares'

export default (express) => {
  const router = express.Router()

  // exercises routes
  router.get(
    '/users/:id/exercises',  
    v1.exercisesController.index);

  router.post(
    '/users/:id/exercises', 
    requireAuth, 
    v1.exercisesController.create);
  // index
  router.get(
    '/users/:id/exercises/:exerciseId', 
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
  router.get('/confirmation/:token', v1.usersController.confirm)
  router.put('/users/:id', requireAuth, v1.usersController.update)
  router.delete('/users/:id', requireAuth, v1.usersController.delete)
  router.post('/reset', v1.usersController.sendResetPasswordEmail)
  router.post(
    '/resetpassword/:userid/:token', 
    v1.usersController.resetNewPassword)

  return router

}
