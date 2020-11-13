const pool = require('../config/db');
const { db } = require('../config/db-promise');
const _ = require('lodash');

exports.getTag = async (name, type) => {
  try {
    return await db.one('SELECT * FROM tag WHERE name = $1 and type = $2', [
      name,
      type,
    ]);
  } catch (err) {
    console.error(`Error getTag: ${err.message}`);
    return null;
  }
};

exports.addTag = async (name, type) => {
  try {
    return await db.one(
      `
        INSERT INTO tag
        (name, type)
        VALUES ($1, $2)
        RETURNING *
        `,
      [name, type]
    );
  } catch (err) {
    console.error(`Error addTag: ${err.message}`);
    return null;
  }
};

exports.getTrackTags = async (track_id) => {
  try {
    tags = await pool.query(
      `
      SELECT * FROM tag
      INNER JOIN track_tag on track_tag.tag_id = tag.tag_id
      WHERE track_tag.track_id = $1
      `,
      [track_id]
    );
    let results = {};
    results[track_id] = tags.rows;
    return results;
  } catch (err) {
    console.error(err);
    return null;
  }
};
