const { pool, query } = require('../config/db');
const { db, pgp } = require('../config/db-promise');
const _ = require('lodash');

exports.addArtists = async (artists) => {
  try {
    const col = ['artist_id', 'name'];
    const data = artists.map((artist) => _.pick(artist, col));
    const cs = new pgp.helpers.ColumnSet(col, {
      table: 'artist',
    });

    const query =
      pgp.helpers.insert(data, cs) +
      `
      ON CONFLICT (artist_id)
      DO UPDATE
      SET name = EXCLUDED.name
      RETURNING *`;

    return db.many(query);
  } catch (err) {
    console.error(`Error model/artist/addArtists: ${err}`);
    return null;
  }
};

exports.getArtist = async (artist_id) => {
  try {
    const artist = await query('SELECT * FROM artist WHERE artist_id = $1', [
      artist_id,
    ]);
    if (artist.rows.length > 0) {
      return artist.rows[0];
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addArtist = async (artist_id, name) => {
  try {
    artist = await query(
      `
        INSERT INTO artist
        (artist_id, name)
        VALUES ($1, $2)
        RETURNING *
        `,
      [artist_id, name]
    );
    return artist.rows[0];
  } catch (err) {
    console.log('Error Creating artist');
    console.error(err.message);
  }
};

exports.updateArtist = async (artist_id, followers, img_url, popularity) => {
  try {
    artist = await query(
      `
        UPDATE artist
        SET followers = $2, img_url = $3, popularity = $4
        WHERE artist_id = $1
        RETURNING *
        `,
      [artist_id, followers, img_url, popularity]
    );
    return artist.rows[0];
  } catch (err) {
    console.log('Error Updating artist');
    console.error(err);
  }
};

exports.getTrackArtists = async (track_id) => {
  try {
    artists = await query(
      `
      SELECT artist.artist_id, artist.name FROM track
      INNER JOIN artist_track on artist_track.track_id = track.track_id
      INNER JOIN artist on artist_track.artist_id = artist.artist_id
      WHERE track.track_id = $1
      `,
      [track_id]
    );
    let results = {};
    results[track_id] = { artists: artists.rows };
    return results;
  } catch (err) {
    console.error(`Error getting track artists: ${err.message}`);
    return null;
  }
};
