const { query } = require('../config/db');

exports.getArtistTag = async (artist_id, tag_id) => {
  try {
    const artistTag = await query(
      'SELECT * FROM artist_tag WHERE artist_id = $1 and tag_id = $2',
      [artist_id, tag_id]
    );
    if (artistTag.rows.length > 0) {
      return artistTag.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error finding Artist Tag');
    console.error(err.message);
  }
};

exports.addArtistTag = async (artist_id, user_id, tag_id) => {
  try {
    artistTag = await query(
      `
            INSERT INTO artist_tag
            (artist_id, user_id, tag_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [artist_id, user_id, tag_id]
    );
    return artistTag.rows[0];
  } catch (err) {
    console.log('Error creating Artist Tag');
    console.error(err.message);
  }
};
