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
    // v1.usersController.facebookOAuthSuccess
  );

  router.post(
    '/auth/google',
    passport.authenticate('google', {
      session: false,
      scope: ['profile', 'email'],
    })
  );

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/login',
    })
    // v1.usersController.googleOAuth
  );

  // When logout, redirect to client
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${config.dev.clienturl}/login`);
  });

  return router;
};
