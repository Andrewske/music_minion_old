const pool = require('../config/db');

exports.addArtistTracks = async (artist_info) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const asyncRes = await Promise.all(
      artist_info.map(async ({ artist_id, track_id }) => {
        const insertText = `
            INSERT INTO artist_track (artist_id, track_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [artist_id, track_id];
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
