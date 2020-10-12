import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';
import * as jwt from 'jsonwebtoken';
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
    // scenario 1 logged in user linking accounts(checking with accesstoken)
    if (!req.lookies) {
      // scenario 2: check if user exists and auth with google
      let user = await models.User.findOne({
        where: { googleId: profile.id },
      });

      const isUserEmail = !!profile.emails;

      // scenario 3: check if user already exists and has local auth email
      //  same as google email

      if (!(user && user.googleId) && isUserEmail) {
        user = await models.User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          await models.User.findOne({
            where: { facebookEmail: profile.emails[0].value },
          });
        }
        if (user) {
          await models.User.update(
            {
              username: profile.displayName,
              googleEmail: profile.emails[0].value,
              confirmed: true,
              googleId: profile.id,
              isGoogleAuth: true,
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
          googleEmail: profile.emails[0].value,
          confirmed: true,
          googleId: profile.id,
          isGoogleAuth: true,
        });

        const userdata = await newUser.save();
        const userExercise = await new models.Exercise({
          chartdata: null,
          progressdata: null,
          weeklylog: null,
          prevData: 0,
          description: null,
          duration: 0,
        });
        userExercise.UserId = userdata.id;
        await userExercise.save();
        return done(null, newUser);
      }
    } else {
      const token = req.cookies['access_token'];
      const decoded = await jwt.verify(token, config.dev.jwt.secret);

      const existingUser = await models.User.update(
        {
          username: profile.displayName,
          googleEmail: profile.emails[0].value,
          confirmed: true,
          googleId: profile.id,
          isGoogleAuth: true,
        },
        {
          where: { id: decoded.id },
        }
      );
      return done(null, existingUser);
    }
  } catch (err) {
    return done(err, false, err.message);
  }
};
passport.use(new GoogleStrategy(options, verifyCallBack));
