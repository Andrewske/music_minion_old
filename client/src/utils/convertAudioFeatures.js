import convertKey from './convertKey';
import convertDuration from '../reducers/convertDuration';
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
    console.error(`Error converting audio features ${features}`);
    console.log(`Features: ${JSON.stringify(features)}`);
    return {
      tempo: 0,
      duration: 0,
      key: { camelot: '' },
      featureGraph: null,
    };
  }
};

export default convertAudioFeatures;
