const axios = require('axios');
const { lastfm } = require('../config/keys');

exports.getTrackInfo = async (method, name, artist) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://ws.audioscrobbler.com/2.0/`,
      params: {
        method: `track.${method}`,
        track: name,
        artist: artist,
        api_key: lastfm.apiKey,
        format: 'json',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (err) {
    console.error(err);
  }
};

exports.getArtistInfo = async (method, artist) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://ws.audioscrobbler.com/2.0/`,
      params: {
        method: `artist.${method}`,
        artist: artist,
        api_key: lastfm.apiKey,
        format: 'json',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (err) {
    console.error(err);
  }
};
