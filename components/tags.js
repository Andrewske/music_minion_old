const { getTag, addTag } = require('../models/tag');
const { getArtistTag, addArtistTag } = require('../models/artist_tag');
const pool = require('../config/db');

exports.createArtistTags = async (artist_id, data, type) => {
  try {
    console.log(`create tags with`);
    console.log(data);
    let asyncRes = await Promise.all(
      data.map(async (x) => {
        const tag = (await getTag(x, type)) || (await addTag(x, type));
        const artist_tag =
          (await getArtistTag(artist_id, tag.id)) ||
          (await addArtistTag(artist_id, tag.id));
        return { tag, artist_tag };
      })
    );
    return asyncRes;
  } catch (err) {
    console.log('Error creating artist tags');
    console.error(err);
  }
};
