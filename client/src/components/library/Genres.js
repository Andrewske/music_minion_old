import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGenres } from '../../actions/genre';
import { loadUser } from '../../actions/auth';
import ListItem from './ListItem';
import Loader from '../layout/Loader';
import store from '../../store';
import _ from 'lodash';

const Genres = ({ getGenres, library: { genres, loading }, sort = null }) => {
  useEffect(() => {
    async function load() {
      await store.dispatch(loadUser());
      await getGenres();
    }
    load();
  }, [getGenres]);

  if (sort) {
    genres = sort.az ? _.orderBy(genres, ['name'], ['asc']) : genres;
    genres = sort.za ? _.orderBy(genres, ['name'], ['desc']) : genres;
    genres = sort.most
      ? _.orderBy(genres, (genre) => _.parseInt(genre.count), ['desc'])
      : genres;
    genres = sort.least
      ? _.orderBy(genres, (genre) => _.parseInt(genre.count), ['asc'])
      : genres;
  }

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {genres &&
          genres.map((genre) => (
            <ListItem
              key={genre.tag_id}
              type='genre'
              current={genre}
              count={genre.count}
            />
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
