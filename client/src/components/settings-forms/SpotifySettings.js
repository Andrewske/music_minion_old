import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startImport } from '../../actions/importLibrary';

const SpotifySettings = ({ startImport }) => {
  const [formData, setFormData] = useState({
    limit: '',
    owner: 'follower',
  });

  const { limit, owner } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClick = (e) => {
    e.preventDefault();
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
          <br />
          <label>
            <input
              type='radio'
              id='follower'
              name='owner'
              value='follower'
              checked={owner === 'follower'}
              onChange={(e) => onChange(e)}
            ></input>
            Import all playlists I own and follow
          </label>{' '}
          <br />
          <label>
            <input
              type='radio'
              id='owner'
              name='owner'
              value='owner'
              checked={owner === 'owner'}
              onChange={(e) => onChange(e)}
            ></input>
            Only import playlists I own
          </label>
          <br />
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
