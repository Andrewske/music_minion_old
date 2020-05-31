const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('User route'));

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
