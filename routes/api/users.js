const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const pool = require('../../config/db');
const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   Post api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      const user = await pool.query(
        'INSERT INTO users (user_id, name, email, password) VALUES(uuid_generate_v4(), $1, $2, $3) RETURNING *',
        [name, email, password_hash]
      );

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
      if (err.constraint === 'users_email_key') {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      } else {
        res.status(500).send('Server Error');
      }
    }
  }
);

module.exports = router;

// app.post('/users', async (req, res) => {
//     try {
//       const { username } = req.body;

//       const newUser = await pool.query(
//         'INSERT INTO users (username) VALUES($1) RETURNING *',
//         [username]
//       );

//       res.json(newUser.rows[0]);
//     } catch (err) {
//       console.error(err);
//     }
//   });
