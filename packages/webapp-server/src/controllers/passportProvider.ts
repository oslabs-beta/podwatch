import passport from 'passport';
import { Express, Request } from 'express';
import { UserModel } from '../models/UserModel';
import GitHubStrategy from 'passport-github';
import { Strategy as GoogleStrategy, VerifyCallback as GoogleVerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { UserModel, UserDocument } from '../models/UserModel';

export const setupPassport = (app: Express) => {
  app.use(passport.initialize());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3001/auth/google/callback',
        passReqToCallback: true,
      },
      function (profile: GoogleProfile, done: GoogleVerifyCallback) {
        const user = UserModel.build({
            email: profile.emails[0].value,
            provider: 'google',
            providerId: profile.id,
            avatar: profile.photos[0].value
        });
        
        done(null, user);
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3001/auth/github/callback',
      },
      function (profile: any, done: any) {
        // create new user in database (if doesn't already exist)
        // return that new (or existing) user as second arg to done
        return done(null, profile);
      }
    )
  );

  const cookieExtractor = function (req: Request) {
    if (req && req.signedCookies) {
      const token = req.signedCookies['podwatch_jwt'];
      return token;
    }
    return null;
  };

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_TOKEN || 'abc',
      },
      async function (jwt_payload, done) {
        // get user from db
        let user: UserDocument | null;
        try {
          user = await UserModel.findOne({ _id: jwt_payload.sub });
        } catch (error: any) {
          return done(error, false);
        }

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      }
    )
  );

  //serialize the user
  passport.serializeUser((user, done) => {
    // const token = jwt.sign(user, process.env.JWT_SECRET_KEY!);
    done(null, user);
  });

  //deserialize the user
  passport.deserializeUser((user: any, done) => {
    try {
      //   const user = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
