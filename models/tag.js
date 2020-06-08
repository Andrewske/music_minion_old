const pool = require('../config/db');

exports.getTag = async (name, type) => {
  try {
    const tag = await pool.query(
      'SELECT * FROM tag WHERE name = $1 and type = $2',
      [name, type]
    );
    if (tag.rows.length > 0) {
      return tag.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addTag = async (name, type) => {
  try {
    tag = await pool.query(
      `
        INSERT INTO tag
        (name, type)
        VALUES ($1, $2)
        RETURNING *
        `,
      [name, type]
    );
    return tag.rows[0];
  } catch (err) {
    console.log('Error Creating tag');
    console.error(err.message);
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
