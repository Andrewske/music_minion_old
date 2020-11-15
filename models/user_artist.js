const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addUserArtists = async (artist_info) => {
  try {
    const col = ['user_id', 'artist_id'];
    const data = artist_info.map((artist) => _.pick(artist, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'user_artist',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (user_id, artist_id)
      DO UPDATE
      SET artist_id = EXCLUDED.artist_id
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/user_artist/addUserArtists: ${err}`);
    return null;
  }
};

exports.getUserArtist = async (user_id, artist_id) => {
  try {
    const userArtist = await query(
      'SELECT * FROM user_artist WHERE user_id = $1 and artist_id = $2',
      [user_id, artist_id]
    );
    if (userArtist.rows.length > 0) {
      return userArtist.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserArtist = async (user_id, artist_id) => {
  try {
    userArtist = await query(
      `
            INSERT INTO user_artist
            (user_id, artist_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [user_id, artist_id]
    );
    return userArtist.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
