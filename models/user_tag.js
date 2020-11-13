const pool = require('../config/db');
const { db } = require('../config/db-promise');

exports.getUserTag = async (user_id, tag_id) => {
  try {
    return await db.one(
      'SELECT * FROM user_tag WHERE user_id = $1 and tag_id = $2',
      [user_id, tag_id]
    );
  } catch (err) {
    console.error(`Error getUserTag: ${err.message}`);
    return null;
  }
};

exports.addUserTag = async (user_id, tag_id) => {
  try {
    return await db.one(
      `
            INSERT INTO user_tag
            (user_id, tag_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [user_id, tag_id]
    );
  } catch (err) {
    console.error(`Error addUserTag: ${err.message}`);
    return null;
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
