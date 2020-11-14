const { db } = require('../config/db-promise');
const _ = require('lodash');

const getTrackData = async (tracks, user_id) => {
  try {
    const track_ids = tracks.map((track) => track.track_id);
    const artist_query = `
      SELECT * FROM artist
      INNER JOIN artist_track ON artist_track.artist_id = artist.artist_id
      WHERE artist_track.track_id = ANY($1::text[])`;

    const af_query = `
      SELECT * FROM audio_features
      WHERE track_id = ANY($1::text[])
    `;

    const tags_query = `
    SELECT * FROM tag
    INNER JOIN track_tag on track_tag.tag_id = tag.tag_id
    WHERE track_tag.track_id = ANY($1::text[]) and track_tag.user_id = $2
    `;

    // const artists = await query(artist_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    // const audio_features = await query(af_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    // const tags = await query(tags_query, [track_ids]); //Promise.all(_.map(track_ids, getTrackArtists));
    const { artists, audio_features, tags } = await db.tx((t) => {
      return t
        .batch([
          t.any(artist_query, [track_ids]),
          t.any(af_query, [track_ids]),
          t.any(tags_query, [track_ids, user_id]),
        ])
        .then((data) => {
          return {
            artists: data[0],
            audio_features: data[1],
            tags: data[2],
          };
        })
        .catch((err) => {
          console.error(`Error getting playlist data: ${err}`);
        });
    });

    tracks = tracks.map((track) => ({
      ...track,
      artists: _.filter(artists, { track_id: track.track_id }),
      audio_features: _.filter(audio_features, {
        track_id: track.track_id,
      }),
      tags: _.filter(tags, { track_id: track.track_id }),
    }));

    return tracks;
  } catch (err) {
    console.error(`Error DB getTrackData ${err}`);
  }
};

module.exports = getTrackData;
