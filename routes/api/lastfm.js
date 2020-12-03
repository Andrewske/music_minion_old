const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const lastFm = require('../../components/lastFm');
const { mbApi } = require('../../config/musicBrainz');
const { db } = require('../../config/db-promise');
const { getMBIDs } = require('../../components/musicBrainz');
const _ = require('lodash');

router.get('/toptracktags/:playlist_id', async (req, res) => {
  try {
    //const { tracks } = req.body; //req.body.data;
    const user = req.body.user;
    const playlist_id = req.params.playlist_id;
    console.log(playlist_id);
    let tracks = await db.any(
      'SELECT * FROM playlist_track INNER JOIN track ON playlist_track.track_id = track.track_id WHERE playlist_id = $1',
      [playlist_id]
    );

    let track_info = tracks.map((track) => _.pick(track, ['name', 'aritsts']));

    // let mbids = await getMBIDs(tracks);

    res.status(200).json(tracks);

    //const trackTags = await lastFm.importTags(tracks);
    // console.log(req.body.data.tracks);
    // const promises = tracks.map(async (track) => {
    //   const name = track.name || null;
    //   const artist =
    //     track.artists
    //       .slice(0)
    //       .reverse()
    //       .map((artist) => artist.name)
    //       .join(' & ') || null;
    //   if (name && artist) {
    //     let tags = await lastFm.getTrackInfo('getTopTags', name, artist);
    //     let error = tags.toptags ? false : true;
    //     if (!error && tags.toptags.tag.length === 0) {
    //       tags = await lastFm.getArtistInfo('getTopTags', artist);
    //     }
    //     if (!error) {
    //       tags = tags.toptags.tag.filter((tag) => tag.count > 10);
    //     }
    //     track.tag_sugg = tags;
    //   }
    //   return track;
    // });

    // const trackTags = await Promise.all(promises);

    //res.status(200).json(trackTags);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: err.message });
  }
});

module.exports = router;
