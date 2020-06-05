const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const pagination = require('../../middleware/pagination');

// @route   GET api/track/me
// @desc    Get all of a users track
// @access  Public
router.get('/me', auth, pagination('track'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
