import axios from 'axios';

export const addTrackTag = async (tag, track_id, user_id) => {
  console.log('Adding Track Tag');
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { type, name } = tag;
    const body = JSON.stringify({ type, name, track_id, user_id });
    await axios.post('api/tag/track', body, config);
  } catch (err) {
    console.log('Error adding track tag');
    console.error(err);
  }
};

export const removeTrackTag = async (tag, track_id, user_id) => {
  console.log('removing track tag');
  console.log(tag);
  try {
    const { type, name } = tag;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        type: type,
        name: name,
        track_id: track_id,
        user_id: user_id,
      },
    };

    //const data = { type, name, track_id, user_id };
    let res = await axios.delete('api/tag/track', config);
    console.log(res);
  } catch (err) {
    console.error(`Error removeTrackTag ${err}`);
  }
};

// export const getTagSuggestions = tracks => async (dispatch) => {
//   console.log("Getting Tag Suggestions")
//   try {
//     const tracks = axios.get()
//   } catch (err) {
//     console.error(`Error getting tag suggestions: ${err.message}`)

//   }
// }
