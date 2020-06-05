const { Pool } = require('pg');
const config = require('config');

const pool = new Pool({
  user: config.get('db_username'),
  password: config.get('db_password'),
  host: 'localhost',
  post: 5432,
  database: 'music_minion',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
