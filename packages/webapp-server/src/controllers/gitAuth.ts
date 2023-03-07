import passport from "passport";
import GitHubStrategy from "passport-github";

passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: "http://localhost:3001/auth/github/callback",
      },
      function (profile: any, done: any) {
        return done(null, profile);
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