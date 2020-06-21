import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startImport } from '../../actions/importLibrary';

const SpotifySettings = ({ startImport }) => {
  const [formData, setFormData] = useState({
    limit: '',
    owner: 'follower',
    useLastFm: false,
  });

  const { limit, owner, useLastFm } = formData;

  const onChange = (e) => {
    e.target.name === 'useLastFm'
      ? setFormData({ ...formData, useLastFm: !useLastFm })
      : setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(useLastFm);
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
          Limit the number of playlists imported to:
          <input
            type='number'
            style={{ width: '50px', marginLeft: '5px' }}
            onChange={(e) => onChange(e)}
            name='limit'
            value={limit}
          ></input>
        </p>
        <label>
          <input
            type='radio'
            id='follower'
            name='owner'
            value='follower'
            checked={owner === 'follower'}
            style={{ marginRight: '5px' }}
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
            style={{ marginRight: '5px' }}
            onChange={(e) => onChange(e)}
          ></input>
          Only import playlists I own
        </label>
        <br />
        <p>
          <input
            type='checkbox'
            id='lastFm'
            name='useLastFm'
            style={{ marginRight: '5px' }}
            onChange={(e) => onChange(e)}
          ></input>
          Automatically use top Track tag imported from LastFM
        </p>
        <br />
        <button onClick={(e) => onClick(e)} className='btn btn-spotify'>
          Import your Spotify Library
        </button>
      </form>
    </Fragment>
  );
};

SpotifySettings.propTypes = {
  startImport: PropTypes.func,
};

export default connect(null, { startImport })(SpotifySettings);
