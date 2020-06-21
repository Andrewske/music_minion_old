import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getArtists } from '../../actions/artist';
import { loadUser } from '../../actions/auth';
import PlaylistItem from './PlaylistItem';
import ListItem from './ListItem';
import Loader from '../layout/Loader';
import store from '../../store';

const Artists = ({ getArtists, library: { artists, loading } }) => {
  useEffect(() => {
    async function load() {
      await store.dispatch(loadUser());
      await getArtists();
    }
    load();
  }, [getArtists]);

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {artists.map((artist) => (
          <ListItem key={artist.artist_id} type='artist' current={artist} />
        ))}
      </div>
    </Fragment>
  );
};

Artists.propTypes = {
  getArtists: PropTypes.func.isRequired,
  artist: PropTypes.object,
};

const mapStateToProps = (state) => ({
  library: state.library,
});

export default connect(mapStateToProps, { getArtists })(Artists);
