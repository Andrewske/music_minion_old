const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const SpotifyStrategy = require('passport-spotify').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { query } = require('./db');
const { db } = require('./db-promise');
const keys = require('./keys');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.one('SELECT * FROM users WHERE user_id = $1', [id]);
    done(null, user);
  } catch (err) {
    console.error(`Error with deserializeUser: ${err.message}`);
  }
});

passport.use(
  'local',
  new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        // Check if the User Exists
        let user = await query('SELECT * FROM users WHERE email = $1', [
          username,
        ]);

        if (!user.rows[0]) {
          // If not throw a login error
          return done(null, false, { msg: 'Oops! Incorrect login details' });
        } else if (!user.rows[0].password) {
          const salt = await bcrypt.genSalt(10);
          const password_hash = await bcrypt.hash(password, salt);

          user = await query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
            [password_hash, username]
          );
          return done(null, user.rows[0]);
        } else {
          const isMatch = await bcrypt.compare(password, user.rows[0].password);

          if (!isMatch) {
            return done(null, false, { msg: 'Oops! Incorrect login details' });
          }
          delete user.rows[0].password;
          done(null, user.rows[0]);
        }
      } catch (err) {
        console.error('Error Authenticating Locally');
        console.error(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      //options for google strategy
      callbackURL: '/api/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback function
      const email = profile._json.email;
      const name = profile._json.name;
      const img_url = profile._json.picture;
      const google_id = profile._json.sub;
      let user = null;

      try {
        user = await query('SELECT * FROM users where email = $1', [email]);
        if (user.rows.length > 0) {
          user = await query(
            'UPDATE users SET google_img_url = $1, google_id = $2 WHERE email = $3 RETURNING *',
            [img_url, google_id, email]
          );
        } else {
          user = await query(
            'INSERT INTO users (user_id, name, email, google_img_url, google_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4) RETURNING *',
            [name, email, img_url, google_id]
          );
        }
        addTokens(user.rows[0].user_id, 'google', accessToken, refreshToken);
        done(null, user.rows[0]);
      } catch (error) {
        console.error('Error Authenticating with Google');
        console.error(error);
      }
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      //options for spotify strategy
      callbackURL: '/api/auth/spotify/redirect',
      clientID: keys.spotify.clientID,
      clientSecret: keys.spotify.clientSecret,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      // passport callback function
      id = profile._json.id;
      name = profile._json.display_name;
      email = profile._json.email;
      img_url = profile.photos[0];

      let user = null;

      try {
        user = await query('SELECT * FROM users where email = $1', [email]);
        if (user.rows.length > 0) {
          user = await query(
            'UPDATE users SET spotify_img_url = $1, spotify_id = $2 WHERE email = $3 RETURNING *',
            [img_url, id, email]
          );
        } else {
          user = await query(
            'INSERT INTO users (user_id, name, email, spotify_img_url, spotify_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4) RETURNING *',
            [name, email, img_url, id]
          );
        }
        addTokens(
          user.rows[0].user_id,
          'spotify',
          accessToken,
          refreshToken,
          expires_in
        );
        done(null, user.rows[0]);
      } catch (error) {
        console.error('Error authenticating with Spotify');
        console.error(error);
      }
    }
  )
);

const addTokens = async (
  user_id,
  platform,
  accessToken,
  refreshToken,
  expires_in = 3600
) => {
  try {
    let userToken = await query(
      'SELECT * FROM user_token WHERE user_id = $1 and platform = $2',
      [user_id, platform]
    );

    if (userToken.rows.length > 0) {
      userToken = await query(
        'UPDATE user_token SET access_token = $1, refresh_token = $2, expires_in = $3, updated_at = NOW() WHERE user_id = $4 and platform = $5',
        [accessToken, refreshToken, expires_in, user_id, platform]
      );
    } else {
      userToken = query(
        'INSERT INTO user_token (token_id, user_id, access_token, refresh_token, expires_in, platform) VALUES (uuid_generate_v4(),$1, $2, $3, $4, $5)',
        [user_id, accessToken, refreshToken, expires_in, platform]
      );
    }
    return userToken.rows[0];
  } catch (err) {
    console.error('Error adding tokens to the database');
    console.error(err.message);
  }
};
