import convertKey from './convertKey';
import convertDuration from './convertDuration';
import convertFeatureGraph from './convertFeatureGraph';

const convertAudioFeatures = (features) => {
  try {
    let { tempo, duration_ms, track_key, mode } = features;
    tempo = Math.round(tempo);
    const key = convertKey(track_key, mode);
    const duration = convertDuration(duration_ms);
    const featureGraph = convertFeatureGraph(features);
    return { tempo, duration, key, featureGraph };
  } catch (err) {
    console.log('Error converting audio features');
    console.error(err);
    return null;
  }
};

export default convertAudioFeatures;
