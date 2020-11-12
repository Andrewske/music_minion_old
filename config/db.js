const { Pool } = require('pg');
const config = require('config');

const pool = new Pool({
  user: config.get('db_username'),
  password: config.get('db_password'),
  host: 'localhost',
  database: 'music_minion',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 100000,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// exports.query = () => {
//   (async (text, values) => {
//     console.log(`Waiting: ${pool.waitingCount}`);
//     console.log(`Total: ${pool.totalCount}`);
//     console.log(`Idle: ${pool.idleCount}`);
//     const client = await pool.connect();
//     let res = null;
//     try {
//       res = await pool.query(text, values);
//     } finally {
//       client.release();
//       return res;
//     }
//   }).catch((err) => console.error('Error executing query, #1', err.stack));
// };

exports.query = async (text, values) => {
  console.log(`start a query: ${text}, ${values}`);
  const client = await pool.connect();
  let res;
  try {
    await client.query('BEGIN');
    try {
      res = await client.query(text, values);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } finally {
    client.release();
    return res;
  }
};

//exports.query = async (text, values) => await pool.query(text, values);
