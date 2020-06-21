const { getTag, addTag } = require('../models/tag');
const { getArtistTag, addArtistTag } = require('../models/artist_tag');
const {
  getTrackTag,
  addTrackTag,
  removeTrackTag,
} = require('../models/track_tag');
const { getUserTag, addUserTag } = require('../models/user_tag');
const { getPlaylistTag, addPlaylistTag } = require('../models/playlist_tag');

exports.createArtistTag = async ({ artist_id, user_id, name, type }) => {
  try {
    const tag = (await getTag(name, type)) || (await addTag(name, type));

    const artist_tag =
      (await getArtistTag(artist_id, tag.tag_id)) ||
      (await addArtistTag(artist_id, user_id, tag.tag_id));

    return { tag, artist_tag };
  } catch (err) {
    console.log('Error creating artist tags');
    console.error(err);
  }
};

exports.createTrackTag = async ({ user_id, track_id, name, type }) => {
  try {
    const tag = (await getTag(name, type)) || (await addTag(name, type));

    const track_tag =
      (await getTrackTag(track_id, tag.tag_id)) ||
      (await addTrackTag(track_id, user_id, tag.tag_id));

    return { tag, track_tag };
  } catch (err) {
    console.log('Error creating track tag');
    console.error(err);
  }
};

exports.createUserTag = async ({ user_id, name, type }) => {
  try {
    const tag = (await getTag(name, type)) || (await addTag(name, type));

    const user_tag =
      (await getUserTag(user_id, tag.tag_id)) ||
      (await addUserTag(user_id, tag.tag_id));

    return { tag, user_tag };
  } catch (err) {
    console.log('Error creating user tag');
    console.error(err);
  }
};

exports.createPlaylistTag = async ({ playlist_id, user_id, name, type }) => {
  try {
    const tag = (await getTag(name, type)) || (await addTag(name, type));

    const playlist_tag =
      (await getPlaylistTag(playlist_id, tag.tag_id)) ||
      (await addPlaylistTag(playlist_id, user_id, tag.tag_id));

    return { tag, playlist_tag };
  } catch (err) {
    console.log('Error creating playlist tag');
    console.error(err);
  }
};

exports.deleteTrackTag = async ({ user_id, track_id, name, type }) => {
  try {
    console.log({ user_id, track_id, name, type });
    const tag = await getTag(name, type);
    console.log(tag);
    const track_tag = await removeTrackTag(track_id, user_id, tag.tag_id);
    console.log(track_tag);
    return 'Tag Deleted';
  } catch (err) {
    console.log('Error removing track tag');
    console.error(err);
    return 'Tag not found';
  }
};
