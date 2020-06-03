const pool = require('../config/db');

exports.getUserTrack = async (user_id, track_id) => {
  try {
    const userTrack = await pool.query(
      'SELECT * FROM user_track WHERE user_id = $1 and track_id = $2',
      [user_id, track_id]
    );
    if (userTrack.rows.length > 0) {
      return userTrack.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserTrack = async (user_id, track_id) => {
  try {
    userTrack = await pool.query(
      `
            INSERT INTO user_track
            (user_id, track_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [user_id, track_id]
    );
    return userTrack.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
