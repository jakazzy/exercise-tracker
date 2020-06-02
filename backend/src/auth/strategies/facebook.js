import passport from 'passport'
import passportFacebook from 'passport-facebook'
import 'dotenv/config';
import { initModels as models } from '../../models'

const FacebookStrategy = passportFacebook.Strategy

export const strategy = (app) => {
 
  const options = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails'],
    enableProof: true,
  }

  const verifyCallBack = async(accessToken, refreshToken, profile, done) => {
    try {
      console.log('user here', profile)
      const user = await models.User.findOne({ 
        where: { facebookId: profile.id } })

      if (user && user.facebookId){
        return done(null, user)

      } else {
        const newUser = new models.User({
          username: profile.displayName,
          email: profile.emails[0],
        });
        return done(null, newUser)
      }

    } catch (err) {
      console.log(err, '************************S');
      
      return done(err)
    }

  }

  passport.use(new FacebookStrategy(options, verifyCallBack))

  app.get('http://localhost:8080/api/v1/auth/facebook',
    passport.authenticate('facebook'))

  app.get(
    `${process.env.BASE_API_URL}/auth/facebook/callback`,
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async(req, res) => {
      const token = await models.User.generateJWT(req.user)
      return res
        .status(200)
        // .cookie('jwt', models.User.generateJWT(req.user), {
        //   httpOnly: true,
        // })
        .send(token)
        .redirect('/')
    }
  )
    
  return app
}
