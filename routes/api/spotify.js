const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const spotify = require('../../components/spotify');
const tags = require('../../components/tags');
const { mbApi } = require('../../config/musicBrainz');
//const { lastfm } = require('../../config/lastfm');
const lastFm = require('../../components/lastFm');

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

// ROUTES

// @route   GET api/spotify/import/playlists
// @desc    Import all the users playlists into the DB
// @access  Private
router.get('/import/playlist/all', async (req, res) => {
  try {
    //Get the User info from DB
    const user = await getUser(req.user.user_id);
    let { user_id, spotify_id } = user;

    //Check that the Spotify Access is valid then Get the users playlists
    let access_token = await spotify.checkAuth(user_id);
    let playlists = await spotify.getPlaylists(spotify_id, access_token);
    const limit = parseInt(req.query.limit) || null;
    const owner = req.query.owner || null;
    if (owner === 'owner') {
      playlists = playlists.filter(
        (playlist) => playlist.owner.id === spotify_id
      );
    }
    if (limit) {
      playlists = playlists.slice(0, limit);
    }

    // Format Playlist Data
    playlist_data = playlists.map((p) => ({
      user_id,
      playlist_id: p.id,
      name: p.name,
      owner: p.owner.id == spotify_id,
      img_url: p.images.length > 0 ? p.images[0].url : null,
      size: p.tracks.total,
      platform: 'spotify',
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
    console.error(err);
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
    console.log('got user');
    let { user_id, spotify_id } = user;

    // Get the playlist_id from params
    const playlist_id = req.params.playlist_id;

    // Check that the Spotify Access is valid then Get the users playlists
    let access_token = await spotify.checkAuth(user_id);
    console.log('checked auth');
    // Get the playlist tracks from Spotify
    let tracks = await spotify.getPlaylistTracks(playlist_id, access_token);
    console.log('got tracks');
    const track_ids = tracks
      .map((t) => {
        try {
          return t.track.id;
        } catch (err) {
          return null;
        }
      })
      .filter((id) => id != null);
    // Format the track info
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
          },
          added_at,
          added_by,
          duration_ms,
          popularity,
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
            { user_id, track_id, playlist_id, name, popularity, artists },
          ];
          artist_info = [...artist_info, ...artists];
        }
      } catch (err) {
        errors = [...errors, { map_error: { index: i, elem: t } }];
      }
    });

    // Add tracks to the database
    const newTracks = await addTracks(track_info);

    // Add the user track record
    const userTracks = await addUserTracks(track_info);

    // Add the artists
    const newArtists = await addArtists(artist_info);

    // Add the artist track references
    const newArtistTracks = await addArtistTracks(artist_info);

    // Add the user artist references
    const newUserArtists = await addUserArtists(artist_info);

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
    const tag_sugg = await lastFm.importTags({
      tracks: track_info,
      user_id,
      useLastFm,
    });

    res.status(200).json({
      total_tracks: tracks.length,
      total_artists: artist_info.length,
      new_tracks: newTracks.length,
      user_tracks: userTracks.length,
      new_artists: newArtists.length,
      new_artist_tracks: newArtistTracks.length,
      new_user_artists: newUserArtists.length,
      new_playlist_tracks: newPlaylistTracks.length,
      new_audio_features: audio_features.length,
      errors,
    });
    console.log('We made it here?');
  } catch (err) {
    console.error(err);
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
