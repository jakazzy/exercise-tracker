import passport from 'passport'
import passportGoogleOauth20 from 'passport-google-oauth20'
import { config } from '../../config/config'
import { initModels as models } from '../../models'

const GoogleStrategy = passportGoogleOauth20.Strategy
const con = config.dev

export const strategy = (app) => {
  const options = {
    clientId: '',
    clientSecret: '',
    callbackURL: '',
    profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
  }

  const verifyCallBack = async(accessToken, refreshToken, profile, done) => {
    try {
      const user = await models.User.findOne({
        where: {googleId: profile.id},
      })

      if (user && user.googleId){
        return done(null, user)
      } else {
        const newUser = new models.User({
          username: profile.displayName,
          email: profile.emails,
        })
        return done(null, newUser)
      }
    } catch (err) {
      return done(err)
    }
  }

  passport.use(new GoogleStrategy(options, verifyCallBack))

  app.get(`${con.baseurl}/auth/google`, passport.authenticate('google'))

  app.get(`${con.baseurl}/auth/google`, 
    passport.authenticate('google', { failureRedirect: '/login' }), 
    async(req, res) => {
      const token = await models.User.generateJWT(req.user)
      return res.status(200).send(token).redirect('/')
    })
  return app
}
