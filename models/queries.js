const pool = require('../config/db');

exports.upsertQuery = async (updateQuery, insertQuery) => {
  return await (async () => {
    const client = await pool.connect();
    await client.query(updateQuery, (err, result) => {
      try {
        if (err) throw err;
        if (result.rowCount > 0) {
          return;
        } else {
          client.query(insertQuery, (error, res) => {
            try {
              if (error) throw error;
            } catch (er) {
              console.error(er);
            } finally {
              return;
            }
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        client.release();
      }
    });
  })().catch((e) => console.log(e));
};
