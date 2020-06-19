const axios = require('axios');
const { lastfm } = require('../config/keys');
const { query } = require('../config/db');

exports.importTags = async (tracks) => {
  try {
    console.log(tracks);
    const promises = tracks.map(async (track) => {
      const name = track.name || null;
      const artist =
        track.artists
          .slice(0)
          .reverse()
          .map((artist) => artist.name)
          .join(' & ') || null;
      if (name && artist) {
        let tags = await this.getTrackInfo('getTopTags', name, artist);
        let error = tags.toptags ? false : true;
        if (!error && tags.toptags.tag.length === 0) {
          tags = await this.getArtistInfo('getTopTags', artist);
        }
        if (!error) {
          tags = tags.toptags.tag.filter((tag) => tag.count > 10);
        }
        const tag_sugg = { lastFm: tags };
        track.tag_sugg = tag_sugg;
        await query('UPDATE track SET tag_sugg = $1 WHERE track_id = $2', [
          tag_sugg,
          track.track_id,
        ]);
      }
      return track;
    });

    const trackTags = await Promise.all(promises);
    return trackTags;
  } catch (err) {
    console.error(err);
    return;
  }
};

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
