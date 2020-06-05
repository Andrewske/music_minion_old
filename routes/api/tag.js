const express = require('express');
const router = express.Router();

const pagination = require('../../middleware/pagination');
const auth = require('../../middleware/auth');
const spotify = require('../../components/spotify');
const tags = require('../../components/tags');
const pool = require('../../config/db');

// Model Imports

// ROUTES TO CREATE A TAG

// @route   POST api/tag/track
// @desc    Create a track tag with {track_id, user_id, name, type}
// @access  Private

router.post('/track', auth, async (req, res) => {
  try {
    const newTag = await tags.createTrackTag(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;

// ROUTES TO CREATE A TAG

// @route   POST api/tag/playlist
// @desc    Create a playlist tag with {playlist_id, user_id, name, type}
// @access  Private

router.post('/playlist', auth, async (req, res) => {
  try {
    const newTag = await tags.createPlaylistTag(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;

// @route   POST api/tag/artist
// @desc    Create a artist tag with {artist_id, user_id, name, type}
// @access  Private

router.post('/artist', auth, async (req, res) => {
  try {
    const newTag = await tags.createArtistTag(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// ROUTES TO GET TAG RESULTS

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
