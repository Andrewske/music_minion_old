const { query } = require('../config/db');

exports.addUserTracks = async (track_info) => {
  try {
    const asyncRes = await Promise.all(
      track_info.map(async ({ user_id, track_id }) => {
        const insertText = `
            INSERT INTO user_track (user_id, track_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [user_id, track_id];
        const res = await query(insertText, insertValues);
        return res.rows;
      })
    );

    return asyncRes;
  } catch (e) {
    console.error('Error Inserting user_tracks');
    throw e;
  }
};

exports.getUserTrack = async (user_id, track_id) => {
  try {
    const res = await query(
      'SELECT * FROM user_track WHERE user_id = $1 and track_id = $2',
      [user_id, track_id]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserTrack = async (user_id, track_id) => {
  try {
    userTrack = await query(
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
