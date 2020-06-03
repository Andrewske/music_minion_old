const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const spotify = require('../../components/spotify');
const pool = require('../../config/db');
const axios = require('axios');
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
    let playlists = await spotify.getPlaylists(spotify_id, access_token);

    res.status(200).json(playlists.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
