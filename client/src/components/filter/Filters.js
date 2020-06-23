import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as FilterIcon } from '../../img/filter.svg';
import { ReactComponent as SortIcon } from '../../img/sort.svg';
import { ReactComponent as NextIcon } from '../../img/next.svg';
import { ReactComponent as BackIcon } from '../../img/back.svg';
import DropdownMenu from '../dropdown/DropdownMenu';
import { connect } from 'react-redux';
import {
  SHOW_PLAYLISTS,
  SHOW_ARTISTS,
  SHOW_TRACKS,
  SHOW_GENRES,
  SHOW_SORT,
  CLOSE_SORT,
  SHOW_FILTER,
  CLEAR_TRACKS,
  CLOSE_FILTER,
} from '../../actions/types';

const Filters = ({
  ShowPlaylists,
  ShowArtists,
  ShowTracks,
  ShowGenres,
  ShowSort,
  ShowFilter,
  showSort,
  showFilter,
  CloseFilter,
  CloseSort,
}) => {
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
  }, []);

  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      CloseFilter();
    }
    if (sortRef.current && !sortRef.current.contains(e.target)) {
      CloseSort();
    }
  };

  return (
    <span className='filter-bar'>
      <span className='filter-buttons'>
        <button className='filter-btn playlist' onClick={ShowPlaylists}>
          Playlists
        </button>
        <button className='filter-btn artist' onClick={ShowArtists}>
          Artists
        </button>
        <button className='filter-btn track' onClick={ShowTracks}>
          Tracks
        </button>
        <button className='filter-btn genre' onClick={ShowGenres}>
          Genres
        </button>
      </span>
      <span className='filter-buttons'>
        <FilterIcon
          className='svg filter-icon playlist'
          ref={filterRef}
          onClick={ShowFilter}
        />
        <BackIcon className='svg filter-icon artist' />
        <p style={{ margin: '3px' }}>1/100</p>
        <NextIcon className='svg filter-icon track' />
        <SortIcon
          className='svg filter-icon genre'
          ref={sortRef}
          onClick={ShowSort}
        ></SortIcon>

        {showSort && <DropdownMenu menu='SortMenu' addClass='sort-dropdown' />}
        {showFilter && (
          <DropdownMenu menu='FilterMenu' addClass='filter-dropdown' />
        )}
      </span>
    </span>
  );
};

Filters.propTypes = {};

const mapStateToProps = (state) => ({
  showSort: state.filter.showSort,
  showFilter: state.filter.showFilter,
});

const mapDispatchToProps = (dispatch) => ({
  ShowPlaylists: () => {
    dispatch({ type: CLEAR_TRACKS });
    dispatch({ type: SHOW_PLAYLISTS });
  },
  ShowArtists: () => {
    dispatch({ type: CLEAR_TRACKS });
    dispatch({ type: SHOW_ARTISTS });
  },
  ShowGenres: () => {
    dispatch({ type: CLEAR_TRACKS });
    dispatch({ type: SHOW_GENRES });
  },
  ShowTracks: () => dispatch({ type: SHOW_TRACKS }),
  ShowSort: () => dispatch({ type: SHOW_SORT }),
  ShowFilter: () => dispatch({ type: SHOW_FILTER }),
  CloseFilter: () => dispatch({ type: CLOSE_FILTER }),
  CloseSort: () => dispatch({ type: CLOSE_SORT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
