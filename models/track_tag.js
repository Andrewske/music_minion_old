const pool = require('../config/db');

exports.getTrackTag = async (track_id, tag_id) => {
  try {
    const trackTag = await pool.query(
      'SELECT * FROM track_tag WHERE track_id = $1 and tag_id = $2',
      [track_id, tag_id]
    );
    if (trackTag.rows.length > 0) {
      return trackTag.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error finding track Tag');
    console.error(err.message);
  }
};

exports.addTrackTag = async (track_id, user_id, tag_id) => {
  try {
    trackTag = await pool.query(
      `
            INSERT INTO track_tag
            (track_id,user_id, tag_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [track_id, user_id, tag_id]
    );
    return trackTag.rows[0];
  } catch (err) {
    console.log('Error creating track Tag');
    console.error(err.message);
  }
};

exports.removeTrackTag = async (track_id, user_id, tag_id) => {
  try {
    trackTag = await pool.query(
      `
            DELETE FROM track_tag
            WHERE track_id = $1 and user_id = $2 and tag_id = $3)
            VALUES ($1, $2, $3)
            `,
      [track_id, user_id, tag_id]
    );
    return trackTag.rows[0];
  } catch (err) {
    console.log('Error creating track Tag');
    console.error(err.message);
  }
};
