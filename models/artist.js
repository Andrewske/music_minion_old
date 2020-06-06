const pool = require('../config/db');

exports.addArtists = async (artists) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const asyncRes = await Promise.all(
      artists.map(async ({ artist_id, name }) => {
        const insertText = `
            INSERT INTO artist (artist_id, name) 
            VALUES ($1, $2)
            ON CONFLICT (artist_id)
            DO UPDATE SET name = artist.name
            RETURNING *`;
        const insertValues = [artist_id, name];
        const res = await client.query(insertText, insertValues);
        return res.rows[0];
      })
    );
    await client.query('COMMIT');
    return asyncRes;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error Inserting user_tracks');
    throw e;
  } finally {
    await client.release();
  }
};

exports.getArtist = async (artist_id) => {
  try {
    const artist = await pool.query(
      'SELECT * FROM artist WHERE artist_id = $1',
      [artist_id]
    );
    //console.log(artist_id);
    if (artist.rows.length > 0) {
      console.log(artist.rows[0]);
      return artist.rows[0];
    } else {
      console.log('false');
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

exports.addArtist = async (artist_id, name) => {
  try {
    artist = await pool.query(
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
    console.log(artist_id);
    console.log('Error Creating artist');
    console.error(err.message);
  }
};

exports.updateArtist = async (artist_id, followers, img_url, popularity) => {
  try {
    artist = await pool.query(
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
    artists = await pool.query(
      `
      SELECT artist.artist_id, artist.name FROM track
      INNER JOIN artist_track on artist_track.track_id = track.track_id
      INNER JOIN artist on artist_track.artist_id = artist.artist_id
      WHERE track.track_id = $1
      `,
      [track_id]
    );
    console.log(artists.rows);
    return artists.rows;
  } catch (err) {
    return null;
    console.error(`Error getting track artists: ${err.message}`);
  }
};
