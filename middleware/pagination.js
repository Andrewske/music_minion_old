//const { getAllUserPlaylists } = require('../../models/playlist');
//const { query } = require('../config/db');
const { db } = require('../config/db-promise');

module.exports = function (model1, model2) {
  return async (req, res, next) => {
    try {
      const id = req.params.id || req.user.user_id;
      const page = parseInt(req.query.page) || null;
      const limit = parseInt(req.query.limit) || null;
      const startIndex = (page - 1) * limit || null;
      const order = req.query.order || `${model2}_id`;
      const direction = req.query.dir === 'up' ? 'ASC' : 'DESC';
      const results = await db.any(
        `SELECT * FROM ${model2} 
        INNER JOIN ${model1}_${model2}
        ON ${model2}.${model2}_id = ${model1}_${model2}.${model2}_id 
        WHERE ${model1}_${model2}.${model1}_id = $1
        ORDER BY ${model2}.${order} ${direction}
        OFFSET ${startIndex}
        LIMIT ${limit}
        `,
        [id]
      );
      res.paginatedResults = results;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'No Pagination' });
    }
  };
};
