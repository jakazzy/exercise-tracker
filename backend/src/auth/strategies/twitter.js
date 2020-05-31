// import passport from 'passport'
// import passportFacebook from 'passport-facebook'
// import { to } from 'await-to-js'

// import { getUserByProviderId, createUser } from '../../database/user'
// import { signToken } from '../utils'

// const FacebookStrategy = passportFacebook.Strategy

// const strategy = app => {
//   const strategyOptions = {
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
//     profileFields: ['id', 'displayName', 'name', 'emails'],
//   }

//   const verifyCallback = async(accessToken, refreshToken, profile, done) => {
//     // TODO
//   }

//   passport.use(new FacebookStrategy(strategyOptions, verifyCallback))

//   return app
// }

// export { strategy }
