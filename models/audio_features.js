const pool = require('../config/db');
const _ = require('lodash');

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
    console.error(`Error getting track audio features: ${err.message}`);
    return null;
  }
};

exports.getPlaylistAudioFeatures = async (playlist_id) => {
  console.log(`getting playlist audio features:`);
  try {
    const results = await pool.query(
      `
          SELECT * FROM audio_features
          INNER JOIN track on audio_features.track_id = track.track_id
          INNER JOIN playlist_track on track.track_id = playlist_track.track_id
          WHERE playlist_track.playlist_id = $1
          `,
      [playlist_id]
    );
    console.log(results);
    const average = (arr) => {
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    };

    const mostCommon = (arr) => {
      try {
        console.log(arr);
        return _.head(_(arr).countBy().entries().maxBy(_.last));
      } catch (err) {
        console.log(arr);
        console.error(err);
        return null;
      }
    };

    const af = results.rows;
    // Get the average for features

    const features = {
      instrumentalness: average(af.map((t) => parseFloat(t.instrumentalness))),
      acousticness: average(af.map((t) => parseFloat(t.acousticness))),
      danceability: average(af.map((t) => parseFloat(t.danceability))),
      duration_ms: average(af.map((t) => parseFloat(t.duration_ms))),
      speechiness: average(af.map((t) => parseFloat(t.speechiness))),
      liveness: average(af.map((t) => parseFloat(t.liveness))),
      loudness: average(af.map((t) => parseFloat(t.loudness))),
      valence: average(af.map((t) => parseFloat(t.valence))),
      energy: average(af.map((t) => parseFloat(t.energy))),
      tempo: average(af.map((t) => parseFloat(t.tempo))),
      track_key: mostCommon(af.map((t) => [t.track_key, t.mode]))[0],
      mode: mostCommon(af.map((t) => [t.track_key, t.mode]))[2],
    };
    return features;
  } catch (err) {
    console.error(`Error getting playlist features: ${err.message}`);
    return null;
  }
};
