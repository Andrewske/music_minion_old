//const { getAllUserPlaylists } = require('../../models/playlist');
const pool = require('../config/db');

module.exports = function (model) {
  return async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const page = parseInt(req.query.page) || null;
      const limit = parseInt(req.query.limit) || null;
      const startIndex = (page - 1) * limit || null;
      const order = req.query.order || `${model}_id`;
      const direction = req.query.dir === 'up' ? 'ASC' : 'DESC';
      const results = await pool.query(
        `SELECT * FROM ${model} 
        INNER JOIN user_${model}
        ON ${model}.${model}_id = user_${model}.${model}_id 
        WHERE user_${model}.user_id = $1
        ORDER BY ${model}.${order} ${direction}
        OFFSET ${startIndex}
        LIMIT ${limit}
        `,
        [user_id]
      );
      console.log(results);

      res.paginatedResults = results.rows;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'No Pagination' });
    }
  };
};
