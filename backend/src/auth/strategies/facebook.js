import passport from 'passport'
import passportFacebook from 'passport-facebook'
import 'dotenv/config';

const FacebookStrategy = passportFacebook.Strategy

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.SERVER_API_URL}/facebook/callback`,
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function(err, user) {
    return cb(err, user);
  });
}
));

