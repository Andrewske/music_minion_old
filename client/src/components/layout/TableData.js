import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import convertAudioFeatures from '../../utils/convertAudioFeatures';

const TableData = (tracks) => {
  const newTrack = (track) => {
    let audio_features = {
      tempo: null,
      duration: null,
      key: null,
      featureGraph: null,
    };
    try {
      audio_features = convertAudioFeatures(track.audio_features[0]);
    } catch (error) {
      console.log('No Audio Features');
    }

    const dateFormatter = (cell) => {
      return moment({ cell }).format('MMM-YYYY');
    };
    return {
      name: track.name,
      artists: _.join(
        track.artists.map((artist) => artist.name),
        ', '
      ),
      bpm: audio_features.tempo,
      key: audio_features.key.camelot,
      tags: _.join(
        track.tags.map((tag) => tag.name),
        ','
      ),
      duration: audio_features.duration,
      added_at: dateFormatter(track.added_at),
    };
  };

  return tracks.map((track) => newTrack(track));
};

export default TableData;
