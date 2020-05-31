const Pool = require('pg').Pool;
const config = require('config');

const pool = new Pool({
  user: config.get('db_username'),
  password: config.get('db_password'),
  host: 'localhost',
  post: 5432,
  database: 'music_minion',
});

module.exports = pool;
