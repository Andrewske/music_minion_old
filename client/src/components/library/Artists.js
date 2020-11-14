import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getArtists } from '../../actions/artist';
import ListItem from './ListItem';
import Loader from '../layout/Loader';
import _ from 'lodash';

const Artists = ({
  getArtists,
  library: { artists, loading },
  sort = null,
}) => {
  useEffect(() => {
    async function load() {
      await getArtists();
    }
    load();
  }, [getArtists]);

  if (sort) {
    artists = sort.az ? _.orderBy(artists, ['name'], ['asc']) : artists;
    artists = sort.za ? _.orderBy(artists, ['name'], ['desc']) : artists;
    artists = sort.most
      ? _.orderBy(artists, (artist) => _.parseInt(artist.count), ['desc'])
      : artists;
    artists = sort.least
      ? _.orderBy(artists, (artist) => _.parseInt(artist.count), ['asc'])
      : artists;
  }

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <div className='item-list'>
        {artists.map((artist) => (
          <ListItem
            key={artist.artist_id}
            type='artist'
            current={artist}
            count={artist.count}
          />
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
