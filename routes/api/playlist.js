const express = require('express');
const router = express.Router();

const { getTrackArtists } = require('../../models/artist');
const { getTrackAudioFeatures } = require('../../models/audio_features');
const pagination = require('../../middleware/pagination');

// @route   GET api/playlist/me
// @desc    Get all of a users playlist
// @access  Public
router.get('/me', pagination('user', 'playlist'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route   GET api/playlist/:id
// @desc    Get a playlists tracks
// @access  Public
router.get('/:id', pagination('playlist', 'track'), async (req, res) => {
  try {
    let tracks = await Promise.all(
      res.paginatedResults.map(async (track) => {
        artists = await getTrackArtists(track.track_id);
        audio_features = await getTrackAudioFeatures(track.track_id);
        track.artists = artists;
        track.audio_features = audio_features;
        return track;
      })
    );
    return res.status(200).json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
