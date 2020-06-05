const pool = require('../config/db');

exports.getUserToken = async (userId, platform) => {
  const client = await pool.connect();
  try {
    const userToken = await client.query(
      `SELECT * FROM user_token
            WHERE user_id = $1 and platform = $2`,
      [userId, platform]
    );
    return userToken.rows[0];
  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
};
