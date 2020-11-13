const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const _ = require('lodash');

const { query } = require('../../config/db');
const { getTrackArtists } = require('../../models/artist');
const { getPlaylistAudioFeatures } = require('../../models/audio_features');
const pagination = require('../../middleware/pagination');

const { db } = require('../../config/db-promise');

router.get('/testing', async (req, res) => {
  console.log('hitting this route');
  try {
    const text = 'SELECT * FROM users WHERE user_id = $1';
    const values = ['97ce3171-d120-4487-868e-62989395996f'];
    const results = await getTrackArtists('0KQd3QY1Y8zC2rfO4ZBQRC');
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

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
    const track_ids = tracks.map((track) => track.track_id);

    artist_query = `
      SELECT * FROM artist
      INNER JOIN artist_track ON artist_track.artist_id = artist.artist_id
      WHERE artist_track.track_id = ANY($1::text[])`;

    af_query = `
      SELECT * FROM audio_features
      WHERE track_id = ANY($1::text[])
    `;

    tags_query = `
    SELECT * FROM tag
    INNER JOIN track_tag on track_tag.tag_id = tag.tag_id
    WHERE track_tag.track_id = ANY($1::text[])
    `;

    // const artists = await query(artist_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    // const audio_features = await query(af_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    // const tags = await query(tags_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    const { artists, audio_features, tags } = await db.tx((t) => {
      return t
        .batch([
          t.any(artist_query, [track_ids]),
          t.any(af_query, [track_ids]),
          t.any(tags_query, [track_ids]),
        ])
        .then((data) => {
          return {
            artists: data[0],
            audio_features: data[1],
            tags: data[2],
          };
        })
        .catch((err) => {
          console.error(`Error getting playlist data: ${err}`);
        });
    });

    tracks = tracks.map((track) => ({
      ...track,
      artists: _.filter(artists, { track_id: track.track_id }),
      audio_features: _.filter(audio_features, {
        track_id: track.track_id,
      }),
      tags: _.filter(tags, { track_id: track.track_id }),
    }));

    const playlist_features = await getPlaylistAudioFeatures(req.params.id);

    return res.status(200).json({ tracks, audio_features: playlist_features });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
