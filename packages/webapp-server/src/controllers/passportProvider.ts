import passport from 'passport';
import { Express, Request } from 'express';
import GitHubStrategy from 'passport-github';
import {
  Strategy as GoogleStrategy,
  VerifyCallback as GoogleVerifyCallback,
  Profile as GoogleProfile,
} from 'passport-google-oauth20';
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
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: GoogleVerifyCallback
      ) {
        console.log(
          `Signing in with Google profile: ${JSON.stringify(profile)}`
        );
        if (!profile.emails || !profile.emails[0]) {
          return done(
            new Error('No email associated with Google account'),
            false
          );
        }

        const { emails, photos, id } = profile;

        const avatar = photos ? photos[0].value : '';

        try {
          const existingUser = await UserModel.findOne({
            email: emails[0].value,
          });
          if (existingUser) {
            console.log('User already exists in db');
            return done(null, existingUser);
          }
        } catch (error: any) {
          console.log('Error occurred searching for user in db');
          return done(error, false);
        }

        const user = UserModel.build({
          email: emails[0].value,
          provider: 'google',
          providerId: id,
          avatar,
        });

        await user.save();

        console.log(
          `Created user: ${JSON.stringify(user)} from Google profile`
        );

        return done(null, user);
      }
    )
  );

  // passport.use(
  //   new GitHubStrategy(
  //     {
  //       clientID: process.env.GITHUB_CLIENT_ID || '',
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  //       callbackURL: 'http://localhost:3001/auth/github/callback',
  //     },
  //     function (profile: any, done: any) {
  //       // create new user in database (if doesn't already exist)
  //       // return that new (or existing) user as second arg to done
  //       return done(null, profile);
  //     }
  //   )
  // );

  const cookieExtractor = function (req: Request) {
    console.log('Extract JWT from cookies');
    if (req && req.signedCookies) {
      console.log('signed cookies:', JSON.stringify(req.signedCookies));
      console.log('cookies:', JSON.stringify(req.cookies));

      const token = req.signedCookies['podwatch_jwt'];
      console.log('Found token:', token);
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
        console.log('Validating JWT...');

        let user: UserDocument | null;
        try {
          user = await UserModel.findOne({ _id: jwt_payload.sub });
          console.log('Found user in database');
        } catch (error: any) {
          console.log('Error occurred searching for user in db');
          return done(error, false);
        }

        if (!user) {
          console.log('Did not find user in db');
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
