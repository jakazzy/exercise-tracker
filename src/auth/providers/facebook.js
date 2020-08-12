import passport from 'passport'
import passportFacebook from 'passport-facebook'
import { initModels as models } from '../../models'
import {config } from '../../config/config'

const FacebookStrategy = passportFacebook.Strategy
const con = config.dev

  const options = {
    clientID: con.facebookAppId,
    clientSecret: con.facebookAppSecret,
    callbackURL: `${con.baseurl}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
    enableProof: true,
  }

  const verifyCallBack = async(accessToken, refreshToken, profile, done) => {
    console.log('aaaaaaaaaaaaaaaaaaaaayou there?');
    try {
      const user = await models.User.findOne({ 
        where: { facebookId: profile.id } })

      if (user && user.facebookId){
        return done(null, user)

      } else {
        // remember to take it out
        console.log(profile, 'profffffffffffffffffffffffffffile');
        
        if (profile.emails === undefined){
          throw new Error('Sorry you cannot sign in with Facebook')
        }
        const userEmail =  profile.emails[0].value
        const newUser = new models.User({
          username: profile.displayName,
          email: userEmail,
          confirmed: true,
          facebookId: profile.id
        });
        await newUser.save()
        return done(null, newUser)
      }

    } catch (err) { 
     done(err, false, err.message)
    }
  }

  passport.use(new FacebookStrategy(options, verifyCallBack))

  

  // app.get(`/api/v1/auth/facebook`,
  //   passport.authenticate('facebook', {authType: 'rerequest'}))

  // app.get(
  //   `https://xercise-tracker-app.herokuapp.com/api/v1/auth/facebook/callback`,
  //   passport.authenticate('facebook', { failureRedirect: '/login' }),
  //   async(req, res) => {
  //     const token = await models.User.generateJWT(req.user)
  //     console.log('why is this callback not called');
  //     return res
  //       .status(200)
  //       // .cookie('jwt', models.User.generateJWT(req.user), {
  //       //   httpOnly: true,
  //       // })
  //       .send(token)
  //       .redirect('/')
  //   }
  // )
    
