import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Img from 'react-image';
//import Tooltip from '../layout/Tooltip';
import ReactTooltip from 'react-tooltip';
import Moment from 'react-moment';
import moment from 'moment';

import convertKey from '../../utils/convertKey';
import convertDuration from '../../utils/convertDuration';

import { ReactComponent as Guitar } from '../../img/guitar.svg';
import { ReactComponent as Disco } from '../../img/diners-club.svg';
import { ReactComponent as Energy } from '../../img/energy.svg';
import { ReactComponent as Piano } from '../../img/piano.svg';
import { ReactComponent as Concert } from '../../img/concert.svg';
import { ReactComponent as Loud } from '../../img/megaphone.svg';
import { ReactComponent as Speech } from '../../img/conversation.svg';
import { ReactComponent as Good } from '../../img/good.svg';

const AudioFeatures = ({ features }) => {
  //   const features = {
  //     duration_ms: 255349,
  //     key: 5,
  //     mode: 0,
  //     time_signature: 4,
  //     acousticness: 0.514,
  //     danceability: 0.735,
  //     energy: 0.578,
  //     instrumentalness: 0.0902,
  //     liveness: 0.159,
  //     loudness: -11.84,
  //     speechiness: 0.0461,
  //     valence: 0.624,
  //     tempo: 98.002,
  //     id: '06AKEBrKUckW0KREUWRnvT',
  //     uri: 'spotify:track:06AKEBrKUckW0KREUWRnvT',
  //     track_href: 'https://api.spotify.com/v1/tracks/06AKEBrKUckW0KREUWRnvT',
  //     analysis_url:
  //       'https://api.spotify.com/v1/audio-analysis/06AKEBrKUckW0KREUWRnvT',
  //     type: 'audio_features',
  //   };
  let { tempo, time_signature, duration_ms, track_key, mode } = features;
  tempo = Math.round(tempo);
  const key = convertKey(track_key, mode);
  const duration = convertDuration(duration_ms);
  const convertAudioFeatures = (af) => {
    // COLORS https://coolors.co/ff0000-ff7f00-ffaa00-ffff00-00ff00-00ff7f-00ffff-0000ff-7f00ff-ff00ff
    const max_pixels = 200;
    const ac = {
      og_value: af.acousticness,
      key: 'acousticness',
      height: Math.round(af.acousticness * max_pixels).toString() + 'px',
      desc: '0-1 confidence the track is acoustic',
      color: '#ff0000',
      img: <Guitar className='audio-icon' />,
    };
    const dc = {
      og_value: af.danceability,
      key: 'danceability',
      height: Math.round(af.danceability * max_pixels).toString() + 'px',
      desc: '0-1 how suitable a track is for dancing',
      color: '#ffaa00',
      img: <Disco className='audio-icon' />,
    };
    const eg = {
      og_value: af.energy,
      key: 'energy',
      height: Math.round(af.energy * max_pixels).toString() + 'px',
      desc: '0-1 perceptual measure of intensity and activity',
      color: '#ffff00',
      img: <Energy className='audio-icon' />,
    };
    const ist = {
      og_value: af.instrumentalness,
      key: 'instrumentalness',
      height: Math.round(af.instrumentalness * max_pixels).toString() + 'px',
      desc: '0-1 prediction for whether a track contains no vocals.',
      color: '#00ff00',
      img: <Piano className='audio-icon' />,
    };
    const lv = {
      og_value: af.liveness,
      key: 'liveness',
      height: Math.round(af.liveness * max_pixels).toString() + 'px',
      desc: '0-1 detects the presence of an audience in the recording',
      color: '#00ffff',
      img: <Concert className='audio-icon' />,
    };
    const ld = {
      og_value: af.loudness,
      key: 'loudness',
      height: Math.round((af.loudness / -60) * max_pixels).toString() + 'px',
      desc: '-60-0 overall loudness of a track in decibels (dB)',
      color: '#0000ff',
      img: <Loud className='audio-icon' />,
    };
    const sp = {
      og_value: af.speechiness,
      key: 'speechiness',
      height: Math.round(af.speechiness * max_pixels).toString() + 'px',
      desc: '0-1 detects the presence of spoken words in a track',
      color: '#7f00ff',
      img: <Speech className='audio-icon' />,
    };
    const vl = {
      og_value: af.valence,
      key: 'valence',
      height: Math.round(af.valence * max_pixels).toString() + 'px',
      desc: 'describing the musical positiveness conveyed by a track',
      color: '#ff00ff',
      img: <Good className='audio-icon' />,
    };
    return [ac, dc, eg, ist, lv, ld, sp, vl];
  };

  const audioFeatures = convertAudioFeatures(features);

  const FeatureBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: 300px;
    margin: auto;
  `;
  const FeatureGraph = styled.div`
    display: flex;
    justify-content: center;
    align-items: middle;
    width: 300px;
    margin: auto;
  `;

  const Feature = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${({ color }) => color};
    width: 25px;
    margin: auto 1px;
    height: ${({ height }) => height};
    position: relative;
  `;

  return (
    <FeatureBox>
      <FeatureGraph>
        {audioFeatures.map((f) => (
          <Feature
            color={f.color}
            height={f.height}
            key={f.key}
            data-tip
            data-for={f.key}
          >
            {f.img}
            <ReactTooltip id={f.key} type='dark' effect='solid'>
              {f.key} : {f.og_value} <br />
              {f.desc}
            </ReactTooltip>
          </Feature>
        ))}
      </FeatureGraph>
      <p>BPM: {tempo}</p>
      {key && (
        <Fragment>
          <p data-tip data-for={key.camelot}>
            Key: <span style={{ color: key.color }}>{key.camelot}</span>
          </p>
          <ReactTooltip id={key.camelot} type='dark' effect='solid'>
            Pitch Notation: {key.pitch} <br />
            <span style={{ fontSize: '8px' }}>
              change default notation in settings
            </span>
          </ReactTooltip>
        </Fragment>
      )}
      <p>Duration: {duration}</p>
    </FeatureBox>
  );
};

AudioFeatures.propTypes = {
  features: PropTypes.object.isRequired,
};

export default AudioFeatures;

// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
