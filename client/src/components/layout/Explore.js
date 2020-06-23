import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Playlists from '../library/Playlists';
import Artists from '../library/Artists';
import Tracks from '../library/Tracks';
import Genres from '../library/Genres';
import { clearTracks } from '../../actions/library';
import { ReactComponent as FilterIcon } from '../../img/filter.svg';
import { ReactComponent as SortIcon } from '../../img/sort.svg';
import { ReactComponent as NextIcon } from '../../img/next.svg';
import { ReactComponent as BackIcon } from '../../img/back.svg';
import DropdownMenu from '../dropdown/DropdownMenu';
import Filters from '../filter/Filters';

const _ = require('lodash');

const Explore = ({
  tracks,
  clearTracks,
  showPlaylists,
  showArtists,
  showTracks,
  showGenres,
}) => {
  // const [filters, setFilters] = useState({
  //   showPlaylists: false,
  //   showTracks: false,
  //   showArtists: false,
  //   showGenres: false,
  //   showSort: false,
  // });
  // // const [showPlaylists, setShowPlaylists] = useState(false);
  // // const [showTracks, setShowTracks] = useState(false);
  // // const [showArtists, setShowArtists] = useState(false);
  // // const [showGenres, setShowGenres] = useState(false);
  // // const [showSort, setShowSort] = useState(false)
  // const {
  //   showPlaylists,
  //   showTracks,
  //   showArtists,
  //   showGenres,
  //   showSort,
  // } = filters;

  // const onClick = async (filter) => {
  //   clearTracks();
  //   let falseFilters;
  //   switch (filter) {
  //     case 'playlists':
  //       falseFilters = _.mapValues(filters, () => false);
  //       return setFilters({ ...falseFilters, showPlaylists: true });
  //     case 'tracks':
  //       falseFilters = _.mapValues(filters, () => false);
  //       return setFilters({ ...falseFilters, showTracks: true });
  //     case 'artists':
  //       falseFilters = _.mapValues(filters, () => false);
  //       return setFilters({ ...falseFilters, showArtists: true });
  //     case 'genres':
  //       falseFilters = _.mapValues(filters, () => false);
  //       return setFilters({ ...falseFilters, showGenres: true });
  //     case 'sort':
  //       return setFilters({ ...filters, showSort: !showSort });
  //     default:
  //       return;
  //   }
  // };

  return (
    <Fragment>
      {/* <span className='filter-bar'>
        <span className='filter-buttons'>
          <button
            className='filter-btn playlist'
            onClick={() => onClick('playlists')}
          >
            Playlists
          </button>
          <button
            className='filter-btn artist'
            onClick={() => onClick('artists')}
          >
            Artists
          </button>
          <button
            className='filter-btn track'
            onClick={() => onClick('tracks')}
          >
            Tracks
          </button>
          <button
            className='filter-btn genre'
            onClick={() => onClick('genres')}
          >
            Genres
          </button>
        </span>
        <span className='filter-buttons'>
          <FilterIcon className='svg filter-icon playlist' />
          <BackIcon className='svg filter-icon artist' />
          <p style={{ margin: '3px' }}>1/100</p>
          <NextIcon className='svg filter-icon track' />
          <SortIcon
            className='svg filter-icon genre'
            onClick={() => onClick('sort')}
          ></SortIcon>

          {showSort && (
            <DropdownMenu
              menu='SortMenu'
              addClass='sort-dropdown'
              //tagData={tagData}
              //setTagData={setTagData}
              setOpen={showSort}
            />
          )}
        </span>
      </span> */}
      <Filters />

      {showPlaylists && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showPlaylists && <Playlists />
      )}
      {showArtists && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showArtists && <Artists />
      )}
      {showTracks && <Tracks />}
      {showGenres && tracks.length !== 0 ? (
        <Tracks />
      ) : (
        showGenres && <Genres />
      )}

      {/* {playlist && tracks.length !== 0 ? <Tracks /> : <Playlists />} */}
    </Fragment>
  );
};

Explore.propTypes = {
  tracks: PropTypes.array,
  playlist: PropTypes.object,
  clearTracks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  playlist: state.library.playlist,
  tracks: state.library.tracks,
  showPlaylists: state.filter.showPlaylists,
  showArtists: state.filter.showArtists,
  showTracks: state.filter.showTracks,
  showGenres: state.filter.showGenres,
});

export default connect(mapStateToProps, { clearTracks })(Explore);
