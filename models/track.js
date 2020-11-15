const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addTracks = async (track_info) => {
  try {
    const col = ['track_id', 'name', 'popularity', 'release_date'];
    const data = track_info.map((track) => _.pick(track, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'track',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (track_id)
      DO UPDATE
      SET name = EXCLUDED.name, popularity = EXCLUDED.popularity, release_date = EXCLUDED.release_date
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(
      `Error model/track/addTracks: ${JSON.stringify(track_info)}, ${err}`
    );
    return null;
  }
};

exports.getTrack = async (track_id) => {
  try {
    const track = await query('SELECT * FROM track WHERE track_id = $1', [
      track_id,
    ]);
    if (track.rows.length > 0) {
      return track.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addTrack = async (track_id, name, popularity) => {
  try {
    track = await query(
      `
        INSERT INTO track
        (track_id, name, popularity)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [track_id, name, popularity]
    );
    return track.rows[0];
  } catch (err) {
    console.log(track_id);
    console.log('Error Creating track');
    console.error(err.message);
  }
};

exports.updateTrack = async (track_id, name, popularity) => {
  try {
    track = await query(
      `
        UPDATE track
        SET name = $2, popularity = $3
        WHERE track_id = $1
        RETURNING *
        `,
      [track_id, name, popularity]
    );
    return track.rows[0];
  } catch (err) {
    console.log('Error Updating track');
    console.error(err);
  }
};

exports.getUserTracks = async (user_id) => {
  try {
    playlists = query(
      `
      SELECT * FROM playlist
      INNER JOIN user_playlist ON playlist.playlist_id = user_playlist.playlist_id
      WHERE user_playlist.user_id = $1
      `,
      [user_id]
    );
    return playlists;
  } catch (err) {
    console.log('Error Fetching Playlists');
    console.error(err);
  }
};
