const { query } = require('../config/db');

exports.addPlaylistTracks = async (track_info) => {
  try {
    const asyncRes = await Promise.all(
      track_info.map(async ({ playlist_id, track_id }) => {
        const insertText = `
            INSERT INTO playlist_track (playlist_id, track_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [playlist_id, track_id];
        const res = await query(insertText, insertValues);
        return res.rows;
      })
    );
    return asyncRes;
  } catch (e) {
    console.error('Error Inserting playlist_tracks');
    throw e;
  }
};

exports.getPlaylistTrack = async (playlist_id, track_id) => {
  try {
    const playlistTrack = await query(
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
    playlistTrack = await query(
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
