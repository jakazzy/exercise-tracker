import passport from 'passport';
// import { initModels as models } from '../models'
import '../auth/providers/google';
import '../auth/providers/facebook';
// import v1 from '../controllers/v1';
import { config } from '../config/config';

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
      successRedirect: `${config.dev.clienturl}/dashboard`,
      failureRedirect: `${config.dev.clienturl}/login`,
    })
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
      successRedirect: `${config.dev.clienturl}/dashboard`,
      failureRedirect: `${config.dev.clienturl}/login`,
    })
    // v1.usersController.googleOAuth
  );

  // Connect the oauth accounts
  router.get('/connect/facebook', passport.authorize('facebook'), {
    session: false,
  });

  router.get('/connect/google', passport.authorize('google'), {
    session: false,
  });

  // When logout, redirect to client
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${config.dev.clienturl}/login`);
  });

  return router;
};
