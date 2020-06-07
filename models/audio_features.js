const pool = require('../config/db');

exports.addAudioFeatures = async (features) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const asyncRes = await Promise.all(
      features.map(
        async ({
          danceability,
          energy,
          key,
          loudness,
          mode,
          speechiness,
          acousticness,
          instrumentalness,
          liveness,
          valence,
          tempo,
          id,
          duration_ms,
          time_signature,
        }) => {
          const insertText = `
              INSERT INTO audio_features (track_id, danceability, energy, track_key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, duration_ms, time_signature) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              ON CONFLICT (track_id)
              DO UPDATE
              SET energy = EXCLUDED.energy
              RETURNING *`;
          const insertValues = [
            id,
            danceability,
            energy,
            key,
            loudness,
            mode,
            speechiness,
            acousticness,
            instrumentalness,
            liveness,
            valence,
            tempo,
            duration_ms,
            time_signature,
          ];
          const res = await client.query(insertText, insertValues);
          return res.rows;
        }
      )
    );
    await client.query('COMMIT');
    return asyncRes;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.release();
  }
};

exports.getTrackAudioFeatures = async (track_id) => {
  try {
    audio_features = await pool.query(
      `
        SELECT * FROM audio_features
        WHERE track_id = $1
        `,
      [track_id]
    );
    return audio_features.rows[0];
  } catch (err) {
    return null;
    console.error(`Error getting track artists: ${err.message}`);
  }
};
