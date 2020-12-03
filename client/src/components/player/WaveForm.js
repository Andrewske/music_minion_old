import React, { useEffect, useRef, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const WaveForm = ({ waveform }) => {
  //Inspiration: https://medium.com/swlh/creating-waveforms-out-of-spotify-tracks-b22030dd442b

  const canvasRef = useRef(null);

  const renderWaveform = () => {
    const canvas = canvasRef.current;
    const { height, width } = canvas.parentNode.getBoundingClientRect();

    canvas.height = height;
    canvas.width = width;

    const context = canvas.getContext('2d');

    for (let x = 0; x < width; x++) {
      if (x % 8 === 0) {
        let i = Math.ceil(waveform.length * (x / width));
        let h = Math.round(waveform[i] * height) / 2;

        context.fillStyle = 'white';

        context.fillRect(x, height / 2 - h, 4, h);
        context.fillRect(x, height / 2, 4, h);
      }
    }
  };

  useEffect(() => {
    if (waveform) {
      renderWaveform();
    }
  });

  useEffect(() => {
    window.onresize = () => renderWaveform();
  });

  return (
    <Fragment>
      <canvas ref={canvasRef} />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  waveform: state.player.waveform,
});

export default connect(mapStateToProps)(WaveForm);
