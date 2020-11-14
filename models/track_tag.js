const pool = require('../config/db');
const { db } = require('../config/db-promise');

exports.getTrackTag = async (track_id, user_id, tag_id) => {
  try {
    return await db.one(
      'SELECT * FROM track_tag WHERE track_id = $1 and tag_id = $2 and user_id = $3',
      [track_id, tag_id, user_id]
    );
  } catch (err) {
    console.error(`Error getTrackTag: ${err.message}`);
    return null;
  }
};

exports.addTrackTag = async (track_id, user_id, tag_id) => {
  try {
    return await db.one(
      `
            INSERT INTO track_tag
            (track_id,user_id, tag_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [track_id, user_id, tag_id]
    );
  } catch (err) {
    console.error(`Error addTrackTag: ${err.message}`);
    return null;
  }
};

exports.removeTrackTag = async (track_id, user_id, tag_id) => {
  try {
    return await db.one(
      `
            DELETE FROM track_tag
            WHERE track_id = $1 AND user_id = $2 AND tag_id = $3
            `,
      [track_id, user_id, tag_id]
    );
  } catch (err) {
    console.error(`Error removeTrackTag: ${err.message}`);
  }
};
