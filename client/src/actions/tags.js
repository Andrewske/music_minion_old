import axios from 'axios';

export const addTrackTag = (tag, track_id, user_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { type, name } = tag;
    const body = JSON.stringify({ type, name, track_id, user_id });
    let res = await axios.post('api/tag/track', body, config);
  } catch (err) {
    console.log('Error adding track tag');
    console.error(err);
  }
};
