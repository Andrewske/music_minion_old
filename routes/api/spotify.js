const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const spotify = require('../../components/spotify');
const tags = require('../../components/tags');
const { mbApi } = require('../../config/musicBrainz');
//const { lastfm } = require('../../config/lastfm');
const lastFm = require('../../components/lastFm');
const _ = require('lodash');

// Model Imports
const { getUser } = require('../../models/users');
const { addPlaylists } = require('../../models/playlist');
const { addUserPlaylists } = require('../../models/user_playlist');
const { addTracks } = require('../../models/track');
const { addUserTracks } = require('../../models/user_track');
const { addUserArtists } = require('../../models/user_artist');
const { addArtists, updateArtist } = require('../../models/artist');
const { addArtistTracks } = require('../../models/artist_track');
const { addPlaylistTracks } = require('../../models/playlist_track');
const { addAudioFeatures } = require('../../models/audio_features');
const { db, pgp } = require('../../config/db-promise');

// ROUTES

// @route   GET api/spotify/import/playlists
// @desc    Import all the users playlists into the DB
// @access  Private
router.get('/import/playlist/all', async (req, res) => {
  try {
    //Get the User info from DB
    const user = await getUser(req.user.user_id);
    const { user_id, spotify_id } = user;

    //Check that the Spotify Access is valid then Get the users playlists
    const access_token = await spotify.checkAuth(user_id);
    const limit = parseInt(req.query.limit) || null;
    const owner = req.query.owner || null;

    let playlists = await spotify.getPlaylists(spotify_id, access_token);

    if (owner === 'owner') {
      playlists = playlists.filter(
        (playlist) => playlist.owner.id === spotify_id
      );
    }
    if (limit) {
      playlists = playlists.slice(0, limit);
    }

    // Get currently existing playlists and check if playlist needs to be created or updated
    const playlist_ids = playlists.map((p) => p.id);
    let existing_playlists = await db.any(
      'SELECT * FROM playlist WHERE playlist_id = ANY($1::text[])',
      [playlist_ids]
    );

    playlists = playlists.reduce((result, p) => {
      let snapshot_id = _.find(existing_playlists, { playlist_id: p.id })
        .snapshot_id;

      if (p.snapshot_id != snapshot_id) {
        result.push(p);
      }
      return result;
    }, []);

    console.log(playlists);

    // Format Playlist Data
    playlist_data = playlists.map((p) => ({
      user_id,
      playlist_id: p.id,
      name: p.name,
      owner: p.owner.id == spotify_id,
      img_url: p.images.length > 0 ? p.images[0].url : null,
      size: p.tracks.total,
      platform: 'spotify',
      snapshot_id: p.snapshot_id,
    }));

    // For each playlist add the data and record to to the playlist and user_playlist models
    let newPlaylists = await addPlaylists(playlist_data);
    let newUserPlaylists = await addUserPlaylists(playlist_data);

    res.status(200).json({
      number_of_playlists: playlist_data.length,
      playlists_created: newPlaylists.length,
      user_playlists_created: newUserPlaylists.length,
      number_of_tracks: playlist_data.reduce((a, b) => ({
        size: a.size + b.size,
      })),
      playlist_data: playlist_data,
    });
  } catch (err) {
    console.error(`Error spotify/import/playlist/all: ${err}`);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/spotify/import/playlists/track
// @desc    Import all the users tracks from playlists into the DB
// @access  Private
router.get('/import/playlist/track/:playlist_id', async (req, res) => {
  try {
    // Get the User info from DB
    const user = await getUser(req.user.user_id);

    let { user_id, spotify_id } = user;

    // Get the playlist_id from params
    const playlist_id = req.params.playlist_id;

    // Check that the Spotify Access is valid then Get the users playlists
    let access_token = await spotify.checkAuth(user_id);

    // Get the playlist tracks from Spotify
    let tracks = await spotify.getPlaylistTracks(playlist_id, access_token);

    // Format the track info

    if (tracks) {
      let track_info = [];
      let artist_info = [];
      let errors = [];
      tracks.map((t, i) => {
        try {
          let {
            track: {
              id: track_id,
              name,
              external_ids: { isrc = null },
              artists,
              album: { release_date },
              popularity,
              duration_ms,
            },
            added_at,
            added_by,
          } = t;

          artists = artists.map((artist) => ({
            user_id,
            track_id,
            artist_id: artist.id,
            name: artist.name,
          }));

          if (track_id) {
            track_info = [
              ...track_info,
              {
                user_id,
                track_id,
                playlist_id,
                name,
                popularity,
                artists,
                release_date: new Date(release_date),
                added_at,
              },
            ];
            artist_info = [...artist_info, ...artists];
          }
        } catch (err) {
          errors = [...errors, { map_error: { index: i, elem: t } }];
        }
      });

      //Get ids and filter out any duplicates
      const track_ids = _.uniq(
        track_info.map((t) => t.track_id || null).filter((id) => id != null)
      );

      track_info = _.uniqBy(track_info, 'track_id');
      artist_info = _.uniqBy(artist_info, 'track_id');

      const artists = _.uniqBy(
        artist_info.map((artist) =>
          _.pick(artist, ['user_id', 'artist_id', 'name'])
        ),
        'artist_id'
      );

      //res.status(200).json(tracks);

      // Add tracks to the database
      const newTracks = await addTracks(track_info);

      // Add the user track record
      const userTracks = await addUserTracks(track_info);

      // Add the artists
      const newArtists = await addArtists(artists);

      // Add the artist track references
      const newArtistTracks = await addArtistTracks(artist_info);

      // Add the user artist references
      const newUserArtists = await addUserArtists(artists);

      // Add the playlist track references
      const newPlaylistTracks = await addPlaylistTracks(track_info);

      // Get the tracks audio features
      const audioFeatures = await spotify.getAudioFeatures(
        track_ids,
        access_token
      );
      // Add Audio features to the db
      const audio_features = await addAudioFeatures(
        audioFeatures['audio_features']
      );

      // Add recommended lastFm tags to db
      const useLastFm = req.query.useLastFm;
      if (useLastFm === 'true') {
        const tag_sugg = await lastFm.importTags({
          tracks: track_info,
          user_id,
          useLastFm,
        });
      }

      res.status(200).json({
        total_tracks: tracks.length,
        total_artists: artists.length,
        new_tracks: newTracks.length,
        user_tracks: userTracks.length,
        new_artists: newArtists.length,
        new_artist_tracks: newArtistTracks.length,
        new_user_artists: newUserArtists.length,
        new_playlist_tracks: newPlaylistTracks.length,
        new_audio_features: audio_features.length,
        errors,
      });
    } else {
      res.status(200).json({
        failed_playlist: playlist_id,
      });
    }
  } catch (err) {
    console.error(`Error with playlist track import ${err}`);
    res.status(500).send(err);
  }
});
// https://open.spotify.com/playlist/23V5rGAnrZ4ODedDPsJJLT?si=V0Yk4TNUSuuxfMfImqfdaA

// @route   GET api/spotify/artist/:artist_id
// @desc    Get the artist info and genre tags
// @access  Private

router.get('/import/artist/:artist_id', async (req, res) => {
  //Get the User info from DB
  const user = await getUser(req.user.user_id);
  let { user_id, spotify_id } = user;

  let access_token = await spotify.checkAuth(user_id);
  let artist_id = req.params.artist_id;
  try {
    const {
      genres,
      followers: { total: followers },
      images,
      popularity,
    } = await spotify.getArtistInfo(artist_id, access_token);

    let tagData = null;
    if (genres.length > 0) {
      tagData = await Promise.all(
        genres.map(async (genre) => {
          return await tags.createArtistTag({
            artist_id,
            user_id,
            genre,
            type: 'genre',
          });
        })
      );
    }
    const img_url = images.length > 0 ? images[images.length - 1].url : null;
    const artist = await updateArtist(
      artist_id,
      followers,
      img_url,
      popularity
    );

    res.status(200).json({ tagData, artist });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
