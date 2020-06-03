const axios = require('axios');
const { spotify } = require('../config/keys');
const pool = require('../config/db');
const { getUserToken } = require('../models/user_token');

// Check the Token Status
exports.checkAuth = async (userId) => {
  const userToken = await getUserToken(userId, 'spotify');
  console.log('UserToken');
  let { access_token, refresh_token, expires_in, updated_at } = userToken;

  if ((Date.now() - updated_at) / 1000 > expires_in) {
    access_token = await this.updateToken(refresh_token);
  }

  return access_token;
};

// Update the expired token
exports.updateToken = async (refresh_token) => {
  const url = 'https://accounts.spotify.com/api/token';

  try {
    res = await axios({
      method: 'post',
      url: url,
      params: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: spotify.clientID,
        client_secret: spotify.clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data.access_token;
  } catch (err) {
    console.error(err.message);
  }
};

exports.getPlaylists = async (
  spotify_id,
  access_token,
  limit = 50,
  offset = 0
) => {
  try {
    let total = 50;
    playlists = [];
    while (offset < total) {
      const res = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/users/${spotify_id}/playlists`,
        params: {
          access_token: access_token,
          limit,
          offset,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      total = res.data.total;
      offset += limit;
      playlists = [...playlists, ...res.data.items];
    }

    return playlists;
  } catch (err) {
    console.log(err.message);
  }
};
