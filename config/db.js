const { Pool } = require('pg');
const config = require('config');

const pool = new Pool({
  user: config.get('db_username'),
  password: config.get('db_password'),
  host: 'localhost',
  database: 'music_minion',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

exports.query = async (text, values) => await pool.query(text, values);
