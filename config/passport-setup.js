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
        console.log(`Refresh: ${refreshToken}`);
        addTokens(user.rows[0].user_id, 'google', accessToken, refreshToken);
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
        user = await pool.query('SELECT * FROM users where email = $1', [
          email,
        ]);
        if (user.rows.length > 0) {
          user = await pool.query(
            'UPDATE users SET spotify_img_url = $1, spotify_id = $2 WHERE email = $3 RETURNING *',
            [img_url, id, email]
          );
        } else {
          user = await pool.query(
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
    let userToken = await pool.query(
      'SELECT * FROM user_token WHERE user_id = $1 and platform = $2',
      [user_id, platform]
    );

    if (userToken.rows.length > 0) {
      userToken = await pool.query(
        'UPDATE user_token SET access_token = $1, refresh_token = $2, expires_in = $3, updated_at = NOW() WHERE user_id = $4 and platform = $5',
        [accessToken, refreshToken, expires_in, user_id, platform]
      );
    } else {
      userToken = pool.query(
        'INSERT INTO user_token (token_id, user_id, access_token, refresh_token, expires_in, platform) VALUES (uuid_generate_v4(),$1, $2, $3, $4, $5)',
        [user_id, accessToken, refreshToken, expires_in, platform]
      );
    }
    return userToken.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
