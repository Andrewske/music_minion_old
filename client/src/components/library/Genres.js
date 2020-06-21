import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGenres } from '../../actions/genre';
import { loadUser } from '../../actions/auth';
import ListItem from './ListItem';
import Loader from '../layout/Loader';
import store from '../../store';

const Genres = ({ getGenres, library: { genres, loading } }) => {
  useEffect(() => {
    async function load() {
      await store.dispatch(loadUser());
      await getGenres();
    }
    load();
  }, [getGenres]);

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {genres &&
          genres.map((genres) => (
            <ListItem key={genres.tag_id} type='genre' current={genres} />
          ))}
      </div>
    </Fragment>
  );
};

Genres.propTypes = {
  getGenres: PropTypes.func.isRequired,
  genre: PropTypes.object,
};

const mapStateToProps = (state) => ({
  library: state.library,
});

export default connect(mapStateToProps, { getGenres })(Genres);
