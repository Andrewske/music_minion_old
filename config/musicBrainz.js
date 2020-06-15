const MusicbrainzApi = require('musicbrainz-api').MusicBrainzApi;

exports.mbApi = new MusicbrainzApi({
  appName: 'music_minion',
  appVersion: '0.1.0',
  appContactInfo: 'andrewskevin92@gmail.com',
});
