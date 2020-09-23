import passport from 'passport';
import passportFacebook from 'passport-facebook';
import * as jwt from 'jsonwebtoken';
import { initModels as models } from '../../models';
import { config } from '../../config/config';

const FacebookStrategy = passportFacebook.Strategy;
const con = config.dev;

const options = {
  clientID: con.facebookAppId,
  clientSecret: con.facebookAppSecret,
  callbackURL: `${con.baseurl}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'name', 'photos', 'email'],
  enableProof: true,
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
    if (!req.cookies['access_token']) {
      // scenario 1: check if user exists and auth with facebook
      let user = await models.User.findOne({
        where: { facebookId: profile.id },
      });

      const isUserEmail = !!profile.emails;

      // scenario 2: check if user already exists and has local auth email
      //  same as facebook email
      if (!(user && user.facebookId) && isUserEmail) {
        user = await models.User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          await models.User.findOne({
            where: { googleEmail: profile.emails[0].value },
          });
        }
        if (user) {
          await models.User.update(
            {
              username: profile.displayName,
              facebookEmail: profile.emails[0].value,
              confirmed: true,
              facebookId: profile.id,
            },
            { where: { id: user.id } }
          );
        }
      }
      // return user from any of the two scenarios for an existing user
      if ((user && user.facebookId) || (user && user.email)) {
        return done(null, user);
      } else {
        // remember to take it out

        if (profile.emails === undefined) {
          throw new Error('Sorry you cannot sign in with Facebook');
        }

        const newUser = new models.User({
          username: profile.displayName,
          facebookEmail: profile.emails[0].value,
          confirmed: true,
          facebookId: profile.id,
        });

        await newUser.save();
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
          facebookId: profile.id,
        },
        {
          where: { id: decoded.id },
        }
      );
      return done(null, existingUser);
    }
  } catch (err) {
    done(err, false, err.message);
  }
};

passport.use(new FacebookStrategy(options, verifyCallBack));
