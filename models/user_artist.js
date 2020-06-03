const pool = require('../config/db');

exports.getUserArtist = async (user_id, artist_id) => {
  try {
    const userArtist = await pool.query(
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
    userArtist = await pool.query(
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
