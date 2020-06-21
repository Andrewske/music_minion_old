const Router = require('express-promise-router');
const router = new Router();
const { query } = require('../../config/db');
const _ = require('lodash');

const pagination = require('../../middleware/pagination');
const { LinkType } = require('musicbrainz-api');

// @route   GET api/artist/me
// @desc    Get all of a users artist
// @access  Public
router.get('/me', pagination('user', 'tag'), async (req, res) => {
  console.log('here');
  try {
    let response = res.paginatedResults.filter((tag) => tag.type === 'genre');
    console.log(response);
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route   GET api/genre/:id
// @desc    Get an genres tracks
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tag_id = req.params.id;
    const user_id = req.user.user_id;
    let tracks = await query(
      `
      SELECT * FROM track
      INNER JOIN track_tag
      ON track.track_id = track_tag.track_id
      WHERE track_tag.tag_id = $1 AND track_tag.user_id = $2
    `,
      [tag_id, user_id]
    );
    tracks = tracks.rows;
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

    return res.status(200).json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
