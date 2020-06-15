const LastFM = require('last-fm');
const { lastfm } = require('./keys');

exports.lastfm = new LastFM(lastfm.apiKey, {
  userAgent: 'music_minion/1.0.0 (https://www.musicminion.app)',
});
