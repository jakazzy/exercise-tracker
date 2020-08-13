import passport from 'passport'
import passportGoogleOauth20 from 'passport-google-oauth20'
import { config } from '../../config/config'
import { initModels as models } from '../../models'

const GoogleStrategy = passportGoogleOauth20.Strategy
const con = config.dev

  const options = {
    clientID: con.googleAppId,
    clientSecret: con.googleAppSecret,
    // callbackURL: `${con.baseurl}/auth/google/callback`,
    profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
  }

  const verifyCallBack = async(accessToken, refreshToken, profile, done) => {
    try {
      console.log(accessToken, 'accessToken');

      const user = await models.User.findOne({
        where: {googleId: profile.id},
      })

      if (user && user.googleId){
        return done(null, user)
      } else {
        const newUser = await new models.User({
          username: profile.displayName,
          email: profile.emails[0].value,
          confirmed: true
        })

        await newUser.save()
        return done(null, newUser)
      }
    } catch (err) {
      return done(err, false, err.message)
    }
  }

  passport.use(new GoogleStrategy(options, verifyCallBack))

  


 

