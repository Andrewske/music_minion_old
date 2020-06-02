const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const pool = require('../../config/db');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const CLIENT_AUTH_URL = 'http://localhost:3000/auth/login?';

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    console.log('Get API/AUTH');
    console.log(req.user);
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      req.user.id,
    ]);

    delete user.rows[0].password;
    console.log(user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Post api/auth
// @desc    Authenticate User & Get Token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await pool.query('SELECT * FROM users where email = $1', [
        email,
      ]);

      if (!user.rows.length > 0) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payload = {
        user: {
          id: user.rows[0].user_id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Authentication with Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

router.get('/google/success', (req, res) => {
  console.log('Success Route');
  console.log(req.user);
  if (req.user) {
    const payload = {
      user: {
        id: req.user.user_id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } else {
    res.send('No User');
  }
});

router.get('/google/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user has failed to authenticate with Google',
  });
});

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: CLIENT_AUTH_URL + 'platform=google',
    failureRedirect: '/auth/login/failed',
  })
);

//Authentication with Spotify
router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'user-read-email',
      'user-read-private',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-modify',
      'user-library-read',
      'user-top-read',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify',
    ],
  })
);

router.get('/spotify/success', (req, res) => {
  console.log('Success Route');
  console.log(req.user);
  if (req.user) {
    const payload = {
      user: {
        id: req.user.user_id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } else {
    res.send('No User');
  }
});

router.get('/spotify/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user has failed to authenticate with Spotify',
  });
});

router.get(
  '/spotify/redirect',
  passport.authenticate('spotify', {
    successRedirect: CLIENT_AUTH_URL + 'platform=spotify',
    failureRedirect: '/auth/login/failed',
  })
);

module.exports = router;
