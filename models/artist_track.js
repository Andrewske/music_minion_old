const { query } = require('../config/db');

exports.addArtistTracks = async (artist_info) => {
  try {
    const asyncRes = await Promise.all(
      artist_info.map(async ({ artist_id, track_id }) => {
        const insertText = `
            INSERT INTO artist_track (artist_id, track_id) 
            VALUES ($1, $2)
            ON CONFLICT
            DO NOTHING`;
        const insertValues = [artist_id, track_id];
        const res = await query(insertText, insertValues);
        return res.rows;
      })
    );
    return asyncRes;
  } catch (e) {
    console.error('Error Inserting user_tracks');
    console.error(e);
  }
};

exports.getArtistTrack = async (artist_id, track_id) => {
  try {
    const artistTrack = await query(
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
    artistTrack = await query(
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
    return null;
  }
};
