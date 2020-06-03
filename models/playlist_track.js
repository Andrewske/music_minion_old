const pool = require('../config/db');

exports.getPlaylistTrack = async (playlist_id, track_id) => {
  try {
    const playlistTrack = await pool.query(
      'SELECT * FROM playlist_track WHERE playlist_id = $1 and track_id = $2',
      [playlist_id, track_id]
    );
    if (playlistTrack.rows.length > 0) {
      return playlistTrack.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addPlaylistTrack = async (playlist_id, track_id, added_at) => {
  try {
    playlistTrack = await pool.query(
      `
            INSERT INTO playlist_track
            (playlist_id, track_id, added_at)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [playlist_id, track_id, added_at]
    );
    return playlistTrack.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
