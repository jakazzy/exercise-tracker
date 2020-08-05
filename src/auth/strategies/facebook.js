import passport from 'passport'
import passportFacebook from 'passport-facebook'
import { initModels as models } from '../../models/'
import {config } from '../../config/config'

const FacebookStrategy = passportFacebook.Strategy
const con = config.dev

export const strategy = (app) => {
  console.log(con.baseurl, '************************S');

  const options = {
    clientID: con.facebookAppId,
    clientSecret: con.facebookAppSecret,
    callbackURL: `${con.baseurl}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
    enableProof: true,
  }

  const verifyCallBack = async(accessToken, refreshToken, profile, done) => {
    try {
      const user = await models.User.findOne({ 
        where: { facebookId: profile.id } })

      if (user && user.facebookId){
        return done(null, user)

      } else {
        const newUser = new models.User({
          username: profile.displayName,
          email: profile.emails,
        });
        return done(null, newUser)
      }

    } catch (err) { 
      return done(err)
    }
  }

  passport.use(new FacebookStrategy(options, verifyCallBack))

  app.get(`/api/v1/auth/facebook`,
    passport.authenticate('facebook', {authType: 'rerequest'}))

  app.get(
    `https://xercise-tracker-app.herokuapp.com/api/v1/auth/facebook/callback`,
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
