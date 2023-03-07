require('dotenv').config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3001/auth/google/callback',
      passReqToCallback: true,
    },
    function (
      profile: any,
      done: any,
    ) {
      done(null, profile);
    }
  )
);

//serialize the user
passport.serializeUser(function (user: any, done) {
  done(null, user);
});

//deserialize the user
passport.deserializeUser(function (user: any, done) {
  done(null, user);
});
