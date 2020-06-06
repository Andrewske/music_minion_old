const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const pool = require('../../config/db');
const bcrypt = require('bcryptjs');

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
    console.log('attempting to register a user');
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      let user = await client.query(
        'SELECT user_id FROM users WHERE email = $1',
        [email]
      );

      if (user.rows.length !== 0) {
        console.log(user.rows);
        errors = [
          {
            msg: 'This email address is already registered. Try loggin in!',
          },
        ];
        return res.status(400).json({
          errors: errors,
        });
      } else {
        user = await client.query(
          'INSERT INTO users (user_id, name, email,password) VALUES (uuid_generate_v4(),$1, $2, $3) RETURNING *',
          [name, email, password_hash]
        );

        client.query('COMMIT');
        delete user.rows[0].password;
        return res.status(200).send(user.rows[0]);
      }
    } catch (err) {
      console.log(err);
      errors = [
        {
          msg: err.message,
        },
      ];
      return res.status(500).json({
        errors: errors,
      });
    } finally {
      client.release();
    }
  }
);

module.exports = router;
