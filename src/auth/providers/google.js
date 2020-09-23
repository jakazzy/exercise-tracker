import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';
import { config } from '../../config/config';
import { initModels as models } from '../../models';

const GoogleStrategy = passportGoogleOauth20.Strategy;
const con = config.dev;

const options = {
  clientID: con.googleAppId,
  clientSecret: con.googleAppSecret,
  callbackURL: `${con.baseurl}/auth/google/callback`,
  profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
  passReqToCallback: true,
};

const verifyCallBack = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    // scenario 3 logged in user linking accounts(checking with accesstoken)
    // scenario 1: check if user exists and auth with google
    let user = await models.User.findOne({
      where: { googleId: profile.id },
    });

    const isUserEmail = !!profile.emails;

    // scenario 2: check if user already exists and  local auth email
    //  same as google email

    if (!(user && user.googleId) && isUserEmail) {
      user = await models.User.findOne({
        where: { email: profile.emails[0].value },
      });

      if (user) {
        await models.User.update(
          {
            username: profile.displayName,
            email: profile.emails[0].value,
            confirmed: true,
            googleId: profile.id,
          },
          { where: { id: user.id } }
        );
      }
    }
    // return user from any of the two scenarios for an existing user ;
    if ((user && user.googleId) || (user && user.email)) {
      return done(null, user);
    } else {
      if (profile.emails === undefined) {
        throw new Error('Sorry you cannot sign in with Google');
      }

      const newUser = await new models.User({
        username: profile.displayName,
        email: profile.emails[0].value,
        confirmed: true,
        googleId: profile.id,
      });
      console.log(
        '**************************************',
        req.cookies['access_token'],
        req.user
      );
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err, false, err.message);
  }
};
passport.use(new GoogleStrategy(options, verifyCallBack));
