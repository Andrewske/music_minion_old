const Router = require('express-promise-router');
const router = new Router();
const { query } = require('../../config/db');
const _ = require('lodash');

const pagination = require('../../middleware/pagination');

// @route   GET api/artist/me
// @desc    Get all of a users artist
// @access  Public
router.get('/me', pagination('user', 'artist'), async (req, res) => {
  try {
    return res.status(200).json(res.paginatedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route   GET api/artist/:id
// @desc    Get an artists tracks
// @access  Public
router.get('/:id', pagination('artist', 'track'), async (req, res) => {
  console.log('here');
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

    const artists = await query(artist_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    const audio_features = await query(af_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    const tags = await query(tags_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    tracks = tracks.map((track) => ({
      ...track,
      artists: _.filter(artists.rows, { track_id: track.track_id }),
      audio_features: _.filter(audio_features.rows, {
        track_id: track.track_id,
      }),
      tags: _.filter(tags.rows, { track_id: track.track_id }),
    }));
    //const playlist_features = await getPlaylistAudioFeatures(req.params.id);
    console.log(tracks);
    return res.status(200).json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
