const { mbApi } = require('../config/musicBrainz');

exports.getMBIDs = async (tracks) => {
  const isrcs = tracks.map((t) => t.isrc);
  try {
    // const promises = isrcs.reduce(async (result, isrc) => {
    //   const res = await mbApi.search('recording', { isrc: [isrc] });
    //   if (parseInt(res.count) > 0) {
    //     result.push(res.recordings[0]);
    //   }
    //   return result;
    // }, []);

    const search = async (isrc) => {
      let track = await mbApi.search('recording', { isrc: isrc });
      return parseInt(track.count) > 0
        ? { mbid: track.recordings[0].id, isrc }
        : { mbid: null, isrc };
    };

    const mbids = await Promise.all(isrcs.map((i) => search(i)));

    return mbids;
  } catch (err) {
    console.error(`Error getMBIDs: ${err}`);
  }

  // playlists = playlists.reduce((result, p) => {
  //   let snapshot_id = _.find(existing_playlists, { playlist_id: p.id })
  //     .snapshot_id;

  //   if (p.snapshot_id != snapshot_id) {
  //     result.push(p);
  //   }
  //   return result;
  // }, []);
};
