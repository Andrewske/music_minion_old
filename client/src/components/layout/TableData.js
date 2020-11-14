import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import convertAudioFeatures from '../../utils/convertAudioFeatures';

const TableData = (tracks) => {
  const newTrack = (track) => {
    let audio_features = null;
    if (track.audio_features[0]) {
      try {
        audio_features = convertAudioFeatures(track.audio_features[0]);
      } catch (error) {
        console.log(track);
        console.log('No Audio Features');
      }
    }

    const dateFormatter = (cell) => {
      return moment({ cell }).format('MMM-YYYY');
    };

    return {
      track_id: track.track_id,
      name: track.name,
      artists: _.join(
        track.artists.map((artist) => artist.name),
        ', '
      ),
      bpm: audio_features ? audio_features.tempo : 0,
      key: audio_features ? audio_features.key.camelot : 'NaN',
      genre_tags: _.join(
        _.compact(
          track.tags.map((tag) => (tag.type === 'genre' ? tag.name : null))
        ),
        ', '
      ),
      playlist_tags: _.join(
        _.compact(
          track.tags.map((tag) => (tag.type === 'playlist' ? tag.name : null))
        ),
        ', '
      ),
      misc_tags: _.join(
        _.compact(
          track.tags.map((tag) => (tag.type === 'misc' ? tag.name : null))
        ),
        ', '
      ),
      duration: audio_features ? audio_features.duration : 0,
      added_at: dateFormatter(track.added_at),
    };
  };

  return tracks.map((track) => newTrack(track));
};

export default TableData;
