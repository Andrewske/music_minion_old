const pool = require('../config/db');

exports.getPlaylistTag = async (playlist_id, tag_id) => {
  try {
    const playlistTag = await pool.query(
      'SELECT * FROM playlist_tag WHERE playlist_id = $1 and tag_id = $2',
      [playlist_id, tag_id]
    );
    if (playlistTag.rows.length > 0) {
      return playlistTag.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error finding playlist tag');
    console.error(err.message);
  }
};

exports.addPlaylistTag = async (playlist_id, user_id, tag_id) => {
  try {
    playlistTag = await pool.query(
      `
            INSERT INTO playlist_tag
            (playlist_id, user_id, tag_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [playlist_id, user_id, tag_id]
    );
    return playlistTag.rows[0];
  } catch (err) {
    console.log('Error creating playlist tag');
    console.error(err.message);
  }
};
