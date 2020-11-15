const { query } = require('../config/db');
const _ = require('lodash');
const { db, pgp } = require('../config/db-promise');

exports.addAudioFeatures = async (features) => {
  try {
    features = features.map((f) => {
      return Object.assign(
        {
          track_id: f.id,
          track_key: f.key,
        },
        _.omit(f, 'id', 'key')
      );
    });

    const col = [
      'danceability',
      'energy',
      'track_key',
      'loudness',
      'mode',
      'speechiness',
      'acousticness',
      'instrumentalness',
      'liveness',
      'valence',
      'tempo',
      'track_id',
      'duration_ms',
      'time_signature',
    ];

    const data = features.map((f) => _.pick(f, col));
    const cs = new pgp.helpers.ColumnSet(col, { table: 'audio_features' });
    const query =
      pgp.helpers.insert(data, cs) +
      `
    ON CONFLICT (track_id)
    DO UPDATE
    SET track_key = EXCLUDED.track_key
    RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/audio_features/addAudioFeatures: ${err}`);
    return null;
  }
};

exports.getTrackAudioFeatures = async (track_id) => {
  try {
    audio_features = await query(
      `
        SELECT * FROM audio_features
        WHERE track_id = $1
        `,
      [track_id]
    );
    let results = {};
    results[track_id] = { results: audio_features.rows[0] };
    return results;
  } catch (err) {
    console.error(`Error getting track audio features: ${err.message}`);
    return null;
  }
};

exports.getPlaylistAudioFeatures = async (playlist_id) => {
  try {
    const results = await db.any(
      `
          SELECT * FROM audio_features
          INNER JOIN track on audio_features.track_id = track.track_id
          INNER JOIN playlist_track on track.track_id = playlist_track.track_id
          WHERE playlist_track.playlist_id = $1
          `,
      [playlist_id]
    );
    const average = (arr) => {
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    };

    const mostCommon = (arr) => {
      try {
        return _.head(_(arr).countBy().entries().maxBy(_.last));
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    const af = results;
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
    console.error(`Error getting playlist features: ${err}`);
    return null;
  }
};
