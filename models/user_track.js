const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addUserTracks = async (track_info) => {
  try {
    const col = ['user_id', 'track_id', 'added_at'];
    const data = track_info.map((track) => _.pick(track, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'user_track',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (user_id, track_id)
      DO UPDATE
      SET added_at = EXCLUDED.added_at
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/track/addUserTracks: ${err}`);
    return null;
  }
};

exports.getUserTrack = async (user_id, track_id) => {
  try {
    const res = await query(
      'SELECT * FROM user_track WHERE user_id = $1 and track_id = $2',
      [user_id, track_id]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserTrack = async (user_id, track_id) => {
  try {
    userTrack = await query(
      `
            INSERT INTO user_track
            (user_id, track_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [user_id, track_id]
    );
    return userTrack.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
