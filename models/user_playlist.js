const pool = require('../config/db');

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

exports.addUserPlaylist = async (userId, playlistId) => {
  try {
    userPlaylist = await pool.query(
      `
            INSERT INTO user_playlist
            (user_id, playlist_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [userId, playlistId]
    );
    return userPlaylist.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
