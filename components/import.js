const { getTrackArtists } = require('../models/artist');
const { getTrackAudioFeatures } = require('../models/audio_features');
const { getTrackTags } = require('../models/tag');
const { query } = require('../config/db');

exports.getTrackData = async (track_id) => {
  //let artists = await getTrackArtists(track_id);
  let artist_results = [];
  let af_results = [];
  let tag_results = [];

  try {
    let artists_text = `
  SELECT artist.artist_id, artist.name FROM artist
  INNER JOIN artist_track on artist.artist_id = artist_track.artist_id
  INNER JOIN track on artist_track.track_id = track.track_id
  WHERE track.track_id = $1
  `;
    let artists_values = [track_id];
    artist_results = await query(artists_text, artists_values);

    let af_text = `
    SELECT * FROM audio_features
    WHERE track_id = $1
    `;
    let af_values = [track_id];
    af_results = await query(af_text, af_values);

    let tag_text = `
    SELECT * FROM tag
    INNER JOIN track_tag on track_tag.tag_id = tag.tag_id
    WHERE track_tag.track_id = $1
    `;
    let tag_values = [track_id];
    tag_results = await query(tag_text, tag_values);
  } catch (error) {
    console.error(track_id);
    console.error(`error getting track data: ${error.message}`);
  }
  //console.log(artists);

  return {
    artists: artist_results.rows || [],
    audio_features: af_results.rows || [],
    tags: tag_results.rows || [],
  };
};
