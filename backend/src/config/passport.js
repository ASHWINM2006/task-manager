const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only register the strategy if credentials are present
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || clientID === 'REPLACE_GOOGLE_CLIENT_ID' ||
    !clientSecret || clientSecret === 'REPLACE_GOOGLE_CLIENT_SECRET') {
  console.warn(
    '⚠️  WARNING: Google OAuth credentials are not set in .env.\n' +
    '   Sign-in with Google will not work until you add:\n' +
    '   GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET'
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos?.[0]?.value || '',
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
