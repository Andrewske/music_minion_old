import React, { Fragment } from 'react';
import styled from 'styled-components';

const AudioFeatures = (props) => {
  const features = {
    duration_ms: 255349,
    key: 5,
    mode: 0,
    time_signature: 4,
    acousticness: 0.514,
    danceability: 0.735,
    energy: 0.578,
    instrumentalness: 0.0902,
    liveness: 0.159,
    loudness: -11.84,
    speechiness: 0.0461,
    valence: 0.624,
    tempo: 98.002,
    id: '06AKEBrKUckW0KREUWRnvT',
    uri: 'spotify:track:06AKEBrKUckW0KREUWRnvT',
    track_href: 'https://api.spotify.com/v1/tracks/06AKEBrKUckW0KREUWRnvT',
    analysis_url:
      'https://api.spotify.com/v1/audio-analysis/06AKEBrKUckW0KREUWRnvT',
    type: 'audio_features',
  };

  const convertAudioFeatures = (af) => {
    const max_pixels = 100;
    const ac = {
      og_value: af.acousticness,
      key: 'acousticness',
      height: Math.round(af.acousticness * max_pixels).toString() + 'px',
      desc: '0-1 confidence the track is acoustic',
    };
    const dc = {
      og_value: af.danceability,
      key: 'danceability',
      height: Math.round(af.danceability * max_pixels).toString() + 'px',
      desc:
        '0-1 how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity',
    };
    const eg = {
      og_value: af.energy,
      key: 'energy',
      height: Math.round(af.energy * max_pixels).toString() + 'px',
      desc: '0-1 perceptual measure of intensity and activity',
    };
    const ist = {
      og_value: af.instrumentalness,
      key: 'instrumentalness',
      height: Math.round(af.instrumentalness * max_pixels).toString() + 'px',
      desc: '0-1 prediction for whether a track contains no vocals.',
    };
    const lv = {
      og_value: af.liveness,
      key: 'liveness',
      height: Math.round(af.liveness * max_pixels).toString() + 'px',
      desc: '0-1 detects the presence of an audience in the recording',
    };
    const ld = {
      og_value: af.loudness,
      key: 'loudness',
      height: Math.round((af.loudness / -60) * max_pixels).toString() + 'px',
      desc: '-60-0 overall loudness of a track in decibels (dB)',
    };
    const sp = {
      og_value: af.speechiness,
      key: 'speechiness',
      height: Math.round(af.speechiness * max_pixels).toString() + 'px',
      desc: '0-1 detects the presence of spoken words in a track',
    };
    const vl = {
      og_value: af.valence,
      key: 'valence',
      height: Math.round(af.valence * max_pixels).toString() + 'px',
      desc: 'describing the musical positiveness conveyed by a track',
    };
    return [ac, dc, eg, ist, lv, ld, sp, vl];
  };

  const audioFeatures = convertAudioFeatures(features);

  const FeatureBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: middle;
    width: 300px;
    margin: auto;
  `;

  const Feature = styled.div`
    background-color: white;
    width: 25px;
    margin: auto;
    height: ${(props) => props.height};
  `;

  return (
    <FeatureBox>
      {audioFeatures.map((f) => (
        <Feature height={f.height} key={f.key}></Feature>
      ))}
    </FeatureBox>
  );
};

export default AudioFeatures;

// These Audio Features will be shown separately
// "duration_ms" : 255349,
// "key" : 5,
// "mode" : 0,
// "time_signature" : 4,
// "tempo" : 98.002,

// Kept on a scale of 0-1, muliply by max pixels
// "acousticness" : 0.514,
// "danceability" : 0.735,
// "energy" : 0.578,
// "instrumentalness" : 0.0902,
// "liveness" : 0.159,
// "speechiness" : 0.0461,
// "valence" : 0.624,

// Kept on scale of -60 and 0, take loudness/60 and multiply by max px
// "loudness" : -11.840,
