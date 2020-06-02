const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const SpotifyStrategy = require('passport-spotify').Strategy;
const pool = require('./db');
const keys = require('./keys');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      id,
    ]);
    done(null, user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

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
        user = await pool.query('SELECT * FROM users where email = $1', [
          email,
        ]);
        if (user.rows.length > 0) {
          user = await pool.query(
            'UPDATE users SET google_img_url = $1, google_id = $2 WHERE email = $3 RETURNING *',
            [img_url, google_id, email]
          );
        } else {
          user = await pool.query(
            'INSERT INTO users (user_id, name, email, google_img_url, google_id) VALUES(uuid_generate_v4(),$1,$2,$3,$4) RETURNING *',
            [name, email, img_url, google_id]
          );
        }
        done(null, user.rows[0]);
      } catch (error) {
        console.error(error);
      }
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      //options for spotify strategy
      callbackURL: '/auth/spotify/redirect',
      clientID: keys.spotify.clientID,
      clientSecret: keys.spotify.clientSecre,
    },
    () => {
      // passport callback function
    }
  )
);
