import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Img from 'react-image';
//import Tooltip from '../layout/Tooltip';
import ReactTooltip from 'react-tooltip';

import convertAudioFeatures from '../../utils/convertAudioFeatures';

const AudioFeatures = ({ features }) => {
  const caf = convertAudioFeatures(features);

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
    caf && (
      <FeatureBox>
        <FeatureGraph>
          {caf.featureGraph.map((f) => (
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
        <p>BPM: {caf.tempo}</p>
        {caf.key && (
          <Fragment>
            <p data-tip data-for={caf.key.camelot}>
              Key:{' '}
              <span style={{ color: caf.key.color }}>{caf.key.camelot}</span>
            </p>
            <ReactTooltip id={caf.key.camelot} type='dark' effect='solid'>
              Pitch Notation: {caf.key.pitch} <br />
              <span style={{ fontSize: '8px' }}>
                change default notation in settings
              </span>
            </ReactTooltip>
          </Fragment>
        )}
        <p>Duration: {caf.duration}</p>
      </FeatureBox>
    )
  );
};

AudioFeatures.propTypes = {
  features: PropTypes.object.isRequired,
};

export default AudioFeatures;

// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
