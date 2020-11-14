const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const _ = require('lodash');

const { query } = require('../../config/db');
const { getTrackArtists } = require('../../models/artist');
const { getPlaylistAudioFeatures } = require('../../models/audio_features');
const pagination = require('../../middleware/pagination');
const getTrackData = require('../../components/getTrackData');

const { db } = require('../../config/db-promise');

// @route   GET api/playlist/me
// @desc    Get all of a users playlist
// @access  Public
router.get('/me', pagination('user', 'playlist'), async (req, res) => {
  try {
    return res.status(200).json({
      playlists: res.paginatedResults,
    });
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
    let tracks = res.paginatedResults;
    const user_id = req.user.user_id || null;

    tracks = await getTrackData(tracks, user_id);

    const playlist_features = await getPlaylistAudioFeatures(req.params.id);

    return res.status(200).json({ tracks, audio_features: playlist_features });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
