const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const pagination = require('../../middleware/pagination');

// ROUTES

// @route   GET api/library/playlist/me
// @desc    Get a list of the users playlists
// @access  Private
router.get('/playlist/me', auth, async (req, res) => {
  try {
    //Get the User info from DB
    const user = await getUser(req.user.user_id);
    let { user_id, spotify_id } = user;

    let playlists = pagination('playlist');

    res.status(200).json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
