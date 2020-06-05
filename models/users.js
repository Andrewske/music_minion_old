const pool = require('../config/db');

exports.getUser = async (user_id) => {
  const client = await pool.connect();
  let res = null;
  try {
    console.log(`userId: ${user_id}`);
    const user = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
      user_id,
    ]);
    res = user.rows[0];
  } catch (err) {
    console.log(err.message);
  } finally {
    client.release();
    return res;
  }
};
