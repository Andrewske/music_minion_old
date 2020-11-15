const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addPlaylistTracks = async (track_info) => {
  try {
    const col = ['playlist_id', 'track_id'];
    const data = track_info.map((track) => _.pick(track, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'playlist_track',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (playlist_id, track_id)
      DO UPDATE
      SET playlist_id = EXCLUDED.playlist_id
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/playlist_track/addPlaylistTracks: ${err}`);
    return null;
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
