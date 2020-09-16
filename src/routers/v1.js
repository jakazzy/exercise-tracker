import v1 from './../controllers/v1';
import { requireAuth } from '../middleware';
import validate from '../lib/routeValidator';

const { validateBody, schemas } = validate;

export default (express) => {
  const router = express.Router();

  // exercises routes
  router.get('/users/:id/exercises', v1.exercisesController.index);

  router.post(
    '/users/:id/exercises',
    requireAuth,
    v1.exercisesController.create
  );
  // index
  router.get('/users/:id/exercises/:exerciseId', v1.exercisesController.show);

  router.put(
    '/users/:id/exercises/:exerciseId',
    requireAuth,
    v1.exercisesController.update
  );

  router.delete(
    '/users/:id/exercises/:exerciseId',
    requireAuth,
    v1.exercisesController.destroy
  );

  // Auth routes
  router.post(
    '/signup',
    validateBody(schemas.authSchema),
    v1.usersController.create
  );
  router.post(
    '/login',
    validateBody(schemas.authSchema),
    v1.usersController.login
  );

  // Users routes
  router.get('/users', v1.usersController.index);
  router.get('/users/:id', v1.usersController.show);
  router.post('/confirmation', v1.usersController.confirm);
  router.post(
    '/resendactivation',
    validateBody(schemas.eactvateSchema),
    v1.usersController.resendactivation
  );
  router.put('/users/:id', requireAuth, v1.usersController.update);
  router.delete('/users/:id', requireAuth, v1.usersController.delete);
  router.post('/reset', v1.usersController.sendResetPasswordEmail);
  router.post(
    '/resetpassword/:userid/:token',
    v1.usersController.resetNewPassword
  );

  router.get('/loginsuccess', v1.usersController.loginSuccess);

  // when login failed, send failed msg
  router.get('/loginfailed', v1.usersController.loginFail);
  return router;
};
