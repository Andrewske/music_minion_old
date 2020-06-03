const pool = require('../config/db');

exports.getArtistTrack = async (artist_id, track_id) => {
  try {
    const artistTrack = await pool.query(
      'SELECT * FROM artist_track WHERE artist_id = $1 and track_id = $2',
      [artist_id, track_id]
    );
    if (artistTrack.rows.length > 0) {
      return artistTrack.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addArtistTrack = async (artist_id, track_id) => {
  try {
    artistTrack = await pool.query(
      `
            INSERT INTO artist_track
            (artist_id, track_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [artist_id, track_id]
    );
    return artistTrack.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
