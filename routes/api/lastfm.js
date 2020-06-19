const express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const lastFm = require('../../components/lastFm');

router.post('/toptracktags', async (req, res) => {
  try {
    const { tracks } = req.body; //req.body.data;
    const trackTags = await lastFm.importTags(tracks);
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

    res.status(200).json(trackTags);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: err.message });
  }
});

module.exports = router;
