const express = require('express');
const router = express.Router();

const pagination = require('../../middleware/pagination');

// @route   GET api/playlist/me
// @desc    Get all of a users playlist
// @access  Public
router.get('/me', pagination('playlist'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
