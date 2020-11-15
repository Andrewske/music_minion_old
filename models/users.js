const { db } = require('../config/db-promise');

exports.getUser = async (user_id) => {
  let res = null;
  try {
    return await db.one(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
  } catch (err) {
    console.log(`Error getUser: ${err.message}`);
  }
};
