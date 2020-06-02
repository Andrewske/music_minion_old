const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const pool = require('../../config/db');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const CLIENT_GOOGLE_AUTH_URL = 'http://localhost:3000/auth/google/login';

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
    successRedirect: CLIENT_GOOGLE_AUTH_URL,
    failureRedirect: '/auth/login/failed',
  })
);

// Authentication with Google
// router.get('/google', (req, res) => {
//   console.log('logging in with Spotify');
//   res.send('success!');
// });

// // Authentication with Google
// router.get('/spotify', (req, res) => {
//   console.log('logging in with Spotify');
// });

module.exports = router;
