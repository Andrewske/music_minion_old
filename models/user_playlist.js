const { query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addUserPlaylists = async (playlist_data) => {
  try {
    const columns = ['playlist_id', 'user_id'];

    const data = playlist_data.map((playlist) => {
      return _.pick(playlist, columns);
    });

    const cs = new pgp.helpers.ColumnSet(columns, {
      table: 'user_playlist',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `ON CONFLICT (user_id, playlist_id) 
      DO UPDATE 
      SET user_playlist_id = EXCLUDED.user_playlist_id 
      RETURNING user_playlist_id`;

    return await db.many(query);
  } catch (err) {
    console.error(`Error models/user_playlist/addUserPlaylist: ${err}`);
  }
};

exports.getUserPlaylist = async (user_id, playlist_id) => {
  try {
    const userPlaylist = await query(
      'SELECT * FROM user_playlist WHERE user_id = $1 and playlist_id = $2',
      [user_id, playlist_id]
    );
    if (userPlaylist.rows.length > 0) {
      return userPlaylist.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addUserPlaylist = async (userId, playlistId, owner) => {
  try {
    userPlaylist = await query(
      `
            INSERT INTO user_playlist
            (user_id, playlist_id, owner)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [userId, playlistId, owner]
    );
    return userPlaylist.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
