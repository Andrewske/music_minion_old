const axios = require('axios');
const { spotify } = require('../config/keys');
const { getUserToken } = require('../models/user_token');

// Check the Token Status
exports.checkAuth = async (userId) => {
  const userToken = await getUserToken(userId, 'spotify');
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
    console.error(`Error updateToken: ${err.message}`);
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
    console.error(`Error getPlaylists: ${err.message}`);
  }
};

exports.getPlaylistTracks = async (
  playlist_id,
  access_token,
  fields = null,
  limit = 100,
  offset = 0
) => {
  try {
    let total = 50;
    tracks = [];
    while (offset < total) {
      const res = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        params: {
          access_token: access_token,
          limit,
          offset,
          market: 'from_token',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      total = res.data.total;
      offset += limit;
      tracks = res.data.items;
    }

    return tracks;
  } catch (err) {
    console.log(`Error getPlaylistTracks: ${err.message}`);
  }
};

exports.getArtistInfo = async (artist_id, access_token) => {
  try {
    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artist_id}`,
      params: { access_token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Error getArtistInfo: ${err}`);
  }
};

exports.getAudioFeatures = async (track_ids, access_token) => {
  try {
    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features?ids=${track_ids}`,
      params: { access_token },
      //body: { ids: track_ids },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Error getAudioFeatures: ${err}`);
  }
};

// Get Audio Analysis https://api.spotify.com/v1/audio-analysis/{id} https://developer.spotify.com/documentation/web-api/reference-beta/#category-tracks

exports.getAudioAnalysis = async (track_id, access_token) => {
  console.log(`Track Id: ${track_id}`);
  try {
    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-analysis/${track_id}`,
      params: { access_token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Error getAudioAnalysis: ${err}`);
    return null;
  }
};
