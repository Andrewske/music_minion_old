import React from 'react';
import { ReactComponent as Guitar } from '../img/guitar.svg';
import { ReactComponent as Disco } from '../img/diners-club.svg';
import { ReactComponent as Energy } from '../img/energy.svg';
import { ReactComponent as Piano } from '../img/piano.svg';
import { ReactComponent as Concert } from '../img/concert.svg';
import { ReactComponent as Loud } from '../img/megaphone.svg';
import { ReactComponent as Speech } from '../img/conversation.svg';
import { ReactComponent as Good } from '../img/good.svg';

const convertFeatureGraph = (af) => {
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

export default convertFeatureGraph;
