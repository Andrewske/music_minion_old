const Router = require('express-promise-router');
const router = new Router();
const { db } = require('../../config/db-promise');
const _ = require('lodash');
const getTrackData = require('../../components/getTrackData');

// @route   GET api/genre/me
// @desc    Get all of a users genres
// @access  Public
router.get('/me', async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const tag_tracks_query = `
      SELECT tag.tag_id as tag_id, name, type, COUNT(*) 
      FROM user_track
      INNER JOIN track_tag
      ON user_track.track_id = track_tag.track_id
      INNER JOIN tag
      ON track_tag.tag_id = tag.tag_id
      WHERE user_track.user_id = $1
      AND track_tag.user_id = $1
      GROUP BY tag.tag_id;
    `;
    const response = await db.any(tag_tracks_query, [user_id]);

    return res.status(200).json(response);
  } catch (err) {
    console.error(`Error getting user genres ${err}`);
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
    let tracks = await db.any(
      `
      SELECT * FROM track
      INNER JOIN track_tag
      ON track.track_id = track_tag.track_id
      WHERE track_tag.tag_id = $1 AND track_tag.user_id = $2
    `,
      [tag_id, user_id]
    );

    tracks = await getTrackData(tracks, user_id);

    return res.status(200).json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
