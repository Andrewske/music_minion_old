const { query } = require('../config/db');

exports.getUserToken = async (userId, platform) => {
  try {
    const userToken = await query(
      `SELECT * FROM user_token
            WHERE user_id = $1 and platform = $2`,
      [userId, platform]
    );
    return userToken.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};
