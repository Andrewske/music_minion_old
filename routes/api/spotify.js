const axios = require('axios');
const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const spotify = require('../../components/spotify');
const pool = require('../../config/db');

//Model Imports
const { getUser } = require('../../models/users');
const {
  getPlaylist,
  getUserPlaylists,
  addPlaylist,
  updatePlaylist,
} = require('../../models/playlist');
const {
  getUserPlaylist,
  addUserPlaylist,
} = require('../../models/user_playlist');
const { getTrack, addTrack, updateTrack } = require('../../models/track');
const { getUserTrack, addUserTrack } = require('../../models/user_track');
const { getArtist, addArtist } = require('../../models/artist');
const { getArtistTrack, addArtistTrack } = require('../../models/artist_track');
const {
  getPlaylistTrack,
  addPlaylistTrack,
} = require('../../models/playlist_track');

// @route   GET api/spotify/import/playlists
// @desc    Import all the users playlists into the DB
// @access  Private
router.get('/import/playlist/all', auth, async (req, res) => {
  try {
    //Get the User info from DB
    const user = await getUser(req.user.id);
    let { user_id, spotify_id } = user;

    //Check that the Spotify Access is valid then Get the users playlists
    let access_token = await spotify.checkAuth(user_id);
    let playlists = await spotify.getPlaylists(spotify_id, access_token);

    // For each playlist add the data and record to to the playlist and user_playlist models
    const asyncRes = await Promise.all(
      playlists.map(async (playlist) => {
        const data = {
          playlist_id: playlist.id,
          name: playlist.name,
          owner: playlist.owner.id,
          img_url: playlist.images.length > 0 ? playlist.images[0].url : null,
          size: playlist.tracks.total,
          platform: 'spotify',
        };
        let newPlaylist = (await getPlaylist(data.playlist_id))
          ? await updatePlaylist(data)
          : await addPlaylist(data);

        let userPlaylist =
          (await getUserPlaylist(user_id, data.playlist_id)) ||
          (await addUserPlaylist(user_id, data.playlist_id));

        return { newPlaylist, userPlaylist };
      })
    );

    res.status(200).json(asyncRes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/spotify/import/playlists/tracks
// @desc    Import all the users tracks from playlists into the DB
// @access  Private
router.get('/import/playlist/track/all', auth, async (req, res) => {
  try {
    //Get the User info from DB
    const user = await getUser(req.user.id);
    let { user_id, spotify_id } = user;

    //Get the User's playlists from DB
    const playlists = await getUserPlaylists(user_id);

    //Check that the Spotify Access is valid then Get the users playlists
    let access_token = await spotify.checkAuth(user_id);
    const playlist_id = playlists.rows[0].playlist_id;
    //For each playlist get the tracks and add them to the database
    console.log(`Playlist ID: ${playlist_id}`);
    let tracks = await spotify.getPlaylistTracks(playlist_id, access_token);

    const asyncRes = await Promise.all(
      tracks.map(async (track) => {
        const data = {
          track_id: track.track.id,
          name: track.track.name,
          platform: 'spotify',
          added_at: track.added_at,
          added_by: track.added_by.id,
          artists: track.track.artists.map((artist) => ({
            artist_id: artist.id,
            name: artist.name,
          })),
          duration_ms: track.duration_ms,
          isrc: track.track.external_ids.isrc || null,
          popularity: track.popularity,
        };

        const {
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
        } = track;

        console.log(`ID: ${track_id}, NAME: ${name}`);

        let newTrack = (await getTrack(track_id))
          ? await updateTrack(track_id, name, popularity)
          : await addTrack(track_id, name, popularity);

        let userTrack =
          (await getUserTrack(user_id, track_id)) ||
          (await addUserTrack(user_id, track_id));

        let newArtists = await Promise.all(
          artists.map(async ({ id: artist_id, name }) => {
            let artist =
              (await getArtist(artist_id)) ||
              (await addArtist(artist_id, name));
            let artistTrack =
              (await getArtistTrack(artist_id, track_id)) ||
              (await addArtistTrack(artist_id, track_id));
            return { artist, artistTrack };
          })
        );

        let playlistTrack =
          (await getPlaylistTrack(playlist_id, track_id)) ||
          (await addPlaylistTrack(playlist_id, track_id, added_at));

        return { newTrack, userTrack, newArtists, playlistTrack };
      })
    );

    res.status(200).json(asyncRes);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
