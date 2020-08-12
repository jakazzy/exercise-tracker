import passport from 'passport'
// import { initModels as models } from '../models'
import '../auth/providers/google'
import '../auth/providers/facebook'
import v1 from '../controllers/v1'

export default (express)=>{
 const router = express.Router()


// router.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: ['profile', 'email']}))

router.get('/auth/facebook',  passport.authenticate('facebook',  { scope : ['email'] }))

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {session: false,  failureRedirect: '/login' }), 
  v1.usersController.facebookOAuth)

router.get('/auth/google', passport.authenticate('google', { session: false, scope: ['profile', 'email']}))
router.get('/auth/google/callback', 
    passport.authenticate('google', {session: false,  failureRedirect: '/login' }), 
  v1.usersController.googleOAuth)


  return router
}