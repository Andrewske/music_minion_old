const { db } = require('../config/db-promise');

exports.getUserToken = async (userId, platform) => {
  try {
    return await db.one(
      `SELECT * FROM user_token
            WHERE user_id = $1 and platform = $2`,
      [userId, platform]
    );
  } catch (err) {
    console.error(`Error getUserToken: ${err.message}`);
  }
};
