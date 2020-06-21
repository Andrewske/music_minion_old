const express = require('express');
const Router = require('express-promise-router');
const router = new Router();

const pagination = require('../../middleware/pagination');
const tags = require('../../components/tags');

// Model Imports

// ROUTES TO CREATE A TAG

// @route   POST api/tag/track
// @desc    Create a track tag with {track_id, user_id, name, type}
// @access  Private

router.post('/track', async (req, res) => {
  try {
    const newTag = await tags.createTrackTag(req.body);
    const userTag = await tags.createUserTag(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// ROUTES TO DELETE A TAG

// @route   DELETE api/tag/track
// @desc    Create a track tag with {track_id, user_id, name, type}
// @access  Private

router.delete('/track', async (req, res) => {
  console.log(req.body);
  try {
    const response = await tags.deleteTrackTag(req.body);

    res.status(200).json({ msg: response });
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

router.post('/playlist', async (req, res) => {
  try {
    const newTag = await tags.createPlaylistTag(req.body);
    const userTag = await tags.createUserTag(req.body);

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

router.post('/artist', async (req, res) => {
  try {
    const newTag = await tags.createArtistTag(req.body);
    const userTag = await tags.createUserTag(req.body);

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
router.get('/me', pagination('track'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
