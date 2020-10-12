import v1 from './../controllers/v1';
import { requireAuth } from '../middleware';
import validate from '../lib/routeValidator';

const { validateBody, schemas } = validate;

export default (express) => {
  const router = express.Router();

  // exercises routes
  router.get('/users/user/exercises', v1.exercisesController.index);

  router.post(
    '/users/user/exercises',
    requireAuth,
    v1.exercisesController.create
  );

  // router.get('/users/:id/exercises/:exerciseId',
  // v1.exercisesController.show);

  router.put(
    '/users/user/exercises',
    requireAuth,
    v1.exercisesController.update
  );

  router.put(
    '/users/user/exercises/weeklylog',
    requireAuth,
    v1.exercisesController.updateWeeklylog
  );
  router.delete(
    '/users/user/exercises/:exerciseId',
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
  router.put('/users/:token', requireAuth, v1.usersController.update);
  router.delete('/users/:id', requireAuth, v1.usersController.delete);
  router.post('/reset', v1.usersController.sendResetPasswordEmail);
  router.post(
    '/resetpassword/:userid/:token',
    v1.usersController.resetNewPassword
  );

  router.get('/loginsuccess', v1.usersController.loginSuccess);

  router.put('/settings', v1.usersController.settings);
  // when login failed, send failed msg
  router.get('/loginfailed', v1.usersController.loginFail);

  router.post('/invitefriend', requireAuth, v1.usersController.inviteFriend);
  router.put('/updateschedule', requireAuth, v1.usersController.updateSchedule);
  router.get(
    '/getscheduleandgoal',
    requireAuth,
    v1.usersController.getScheduleAndGoal
  );
  router.put('updategoal', requireAuth, v1.usersController.updateGoal);

  // When logout, redirect to client
  router.get('/signout', v1.usersController.signOut);

  // check status
  router.get('/checkstatus', requireAuth, v1.usersController.loginStatus);
  return router;
};
