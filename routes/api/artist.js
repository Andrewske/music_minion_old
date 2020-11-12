const Router = require('express-promise-router');
const router = new Router();
const { query } = require('../../config/db');
const _ = require('lodash');
const { db } = require('../../config/db-promise');

const pagination = require('../../middleware/pagination');

// @route   GET api/artist/me
// @desc    Get all of a users artist
// @access  Public
router.get('/me', pagination('user', 'artist'), async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const artist_tracks_query = `
      SELECT artist_id, COUNT(*) FROM user_track
      INNER JOIN artist_track
      ON user_track.track_id = artist_track.track_id
      WHERE artist_track.artist_id = $1
      AND user_track.user_id = $2
      GROUP BY artist_id;
    `;

    const counts = await db
      .tx((t) => {
        return t.batch(
          res.paginatedResults.map((artist) =>
            t.one(artist_tracks_query, [artist.artist_id, user_id])
          )
        );
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(`Error with db-promise: ${err}`);
        if (err.name === 'BatchError') {
          return err.data.map((data) => {
            return data.success === true
              ? data.result
              : { artist_id: null, count: null };
          });
        }
      });
    if (counts) {
      let results = res.paginatedResults.map((artist) => {
        artist['count'] = counts.find(
          (x) => (x.artist_id = artist.artist_id)
        ).count;
        return artist;
      });
      return res.status(200).json(results);
    } else {
      return res.status(500).json({ msg: 'DB Error' });
    }

    // let results = await Promise.all(
    //   res.paginatedResults.map(async (artist) => {
    //     let count = await query(artist_tracks_query, [
    //       artist.artist_id,
    //       user_id,
    //     ]);
    //     artist['track_count'] = count.rows[0].count || 0;
    //     return artist;
    //   })
    // );
    //const artist_id = res.paginatedResults[0].artist_id;
    //let results = await query(artist_tracks_query, [artist_id, user_id]);
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
