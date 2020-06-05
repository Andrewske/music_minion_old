const pool = require('../config/db');

exports.addUserPlaylists = async (playlist_data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const asyncRes = await Promise.all(
      playlist_data.map(async ({ user_id, playlist_id }) => {
        const insertText = `
            INSERT INTO user_playlist (user_id, playlist_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [user_id, playlist_id];
        const res = await client.query(insertText, insertValues);
        return res.rows;
      })
    );
    await client.query('COMMIT');
    return asyncRes;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error Inserting user_playlists');
    throw e;
  } finally {
    await client.release();
  }
};

exports.getUserPlaylist = async (user_id, playlist_id) => {
  try {
    const userPlaylist = await pool.query(
      'SELECT * FROM user_playlist WHERE user_id = $1 and playlist_id = $2',
      [user_id, playlist_id]
    );
    if (userPlaylist.rows.length > 0) {
      return userPlaylist.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserPlaylist = async (userId, playlistId, owner) => {
  try {
    userPlaylist = await pool.query(
      `
            INSERT INTO user_playlist
            (user_id, playlist_id, owner)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [userId, playlistId, owner]
    );
    return userPlaylist.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
