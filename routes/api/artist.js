const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const pagination = require('../../middleware/pagination');

// @route   GET api/artist/me
// @desc    Get all of a users artist
// @access  Public
router.get('/me', auth, pagination('artist'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
