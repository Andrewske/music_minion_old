const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addArtistTracks = async (artist_info) => {
  try {
    const col = ['artist_id', 'track_id'];
    const data = artist_info.map((artist) => _.pick(artist, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'artist_track',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (artist_id, track_id)
      DO UPDATE
      SET artist_id = EXCLUDED.artist_id
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/artist_track/addArtistTracks: ${err}`);
    return null;
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
