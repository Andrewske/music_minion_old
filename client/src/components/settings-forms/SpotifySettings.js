import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startImport } from '../../actions/importLibrary';

const SpotifySettings = ({ startImport }) => {
  const [formData, setFormData] = useState({
    limit: null,
  });

  const { limit } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClick = (e) => {
    e.preventDefault();
    console.log('run this');
    startImport(formData);
  };

  return (
    <Fragment>
      <form>
        <div>
          <h3>Import your Spotify Library</h3>
        </div>
        <p>
          Limit the number of playlists imported to:{' '}
          <input
            type='number'
            style={{ width: '50px' }}
            onChange={(e) => onChange(e)}
            name='limit'
            value={limit}
          ></input>
        </p>

        <button onClick={(e) => onClick(e)} className='btn btn-spotify'>
          Import your Spotify Library
        </button>
      </form>

      <p></p>
    </Fragment>
  );
};

SpotifySettings.propTypes = {
  startImport: PropTypes.func,
};

export default connect(null, { startImport })(SpotifySettings);
