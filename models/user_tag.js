const pool = require('../config/db');

exports.getUserTag = async (user_id, tag_id) => {
  try {
    const userTag = await pool.query(
      'SELECT * FROM user_tag WHERE user_id = $1 and tag_id = $2',
      [user_id, tag_id]
    );
    if (userTag.rows.length > 0) {
      return userTag.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error finding user Tag');
    console.error(err.message);
  }
};

exports.addUserTag = async (user_id, tag_id) => {
  try {
    userTag = await pool.query(
      `
            INSERT INTO user_tag
            (user_id, tag_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [user_id, tag_id]
    );
    return userTag.rows[0];
  } catch (err) {
    console.log('Error creating user Tag');
    console.error(err.message);
  }
};

exports.removeUserTag = async (user_id, tag_id) => {
  try {
    userTag = await pool.query(
      `
            DELETE FROM user_tag
            WHERE user_id = $1 AND tag_id = $3
            `,
      [user_id, tag_id]
    );
    console.log(userTag);
    return userTag.rows[0];
  } catch (err) {
    console.log('Error deleting user Tag');
    console.error(err.message);
  }
};
