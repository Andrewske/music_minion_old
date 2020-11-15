const config = require('config');
const initOptions = {};

const connection = {
  user: config.get('db_username'),
  password: config.get('db_password'),
  host: 'localhost',
  database: 'music_minion',
  max: 30,
  idleTimeoutMillis: 30000,
  query_timeout: 100000,
};

const pgp = require('pg-promise')(initOptions);

exports.db = pgp(connection);
exports.pgp = pgp;
