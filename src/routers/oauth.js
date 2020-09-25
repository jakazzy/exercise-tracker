import passport from 'passport';
// import { initModels as models } from '../models'
import '../auth/providers/google';
import '../auth/providers/facebook';
import v1 from '../controllers/v1';
import { config } from '../config/config';
import { requireAuth } from '../middleware';

export default (express) => {
  const router = express.Router();

  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      session: false,
      failureRedirect: `${config.dev.clienturl}/login`,
    }),
    v1.usersController.facebookOAuth
  );

  router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${config.dev.clienturl}/login`,
    }),
    v1.usersController.googleOAuth
  );

  // Connect the oauth accounts
  // router.get('/connect/facebook', passport.authorize('facebook'), {
  //   session: false,
  // });
  // router.get('/connect/facebook/callback', passport.authorize('facebook'), {
  //   session: false,
  // });

  router.get(
    '/connect/google',
    requireAuth,
    passport.authorize('google', {
      session: false,
      scope: ['profile', 'email'],
    })
  );

  router.get(
    '/connect/google/callback',
    requireAuth,
    passport.authorize('google', {
      session: false,
      successRedirect: '/profile',
      failureRedirect: '/',
    })
  );

  // When logout, redirect to client
  router.get('/signout', v1.usersController.signOut);

  // check status
  router.get('/checkstatus', requireAuth, v1.usersController.loginStatus);
  return router;
};
