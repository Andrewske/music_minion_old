const pool = require('../config/db');
const { upsertQuery } = require('./queries');

exports.addUserTracks = async (track_info) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const asyncRes = await Promise.all(
      track_info.map(async ({ user_id, track_id }) => {
        const insertText = `
            INSERT INTO user_track (user_id, track_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [user_id, track_id];
        const res = await client.query(insertText, insertValues);
        return res.rows;
      })
    );
    await client.query('COMMIT');
    return asyncRes;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error Inserting user_tracks');
    throw e;
  } finally {
    await client.release();
  }
};

exports.upsertUserTrack = async (user_id, track_id) => {
  const insertQuery = {
    text: 'INSERT INTO user_track (user_id, track_id) VALUES ($1, $2)',
    values: [user_id, track_id],
  };
  const updateQuery = {
    text: 'UPDATE user_track SET track_id = $2 WHERE user_id = $1',
    values: [user_id, track_id],
  };
  return await upsertQuery(updateQuery, insertQuery);
};

exports.getUserTrack = async (user_id, track_id) => {
  try {
    const res = await pool.query(
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
