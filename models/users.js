const { query } = require('../config/db');

exports.getUser = async (user_id) => {
  let res = null;
  try {
    const user = await query(`SELECT * FROM users WHERE user_id = $1`, [
      user_id,
    ]);
    res = user.rows[0];
    return res;
  } catch (err) {
    console.log(err.message);
  }
};
