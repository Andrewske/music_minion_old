import React, { Fragment, useState, useRef, useEffect } from 'react';
import { ReactComponent as FilterIcon } from '../../img/filter.svg';
import { ReactComponent as SortIcon } from '../../img/sort.svg';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SlideDown } from 'react-slidedown';
import Playlists from '../library/Playlists';
import Artists from '../library/Artists';
import Genres from '../library/Genres';
import Loader from './Loader';
import {
  SHOW_PLAYLISTS,
  CLEAR_TRACKS,
  OWNED_PLAYLISTS,
} from '../../actions/types';

const Sidebar = ({
  hidden = false,
  playlist: { loading, playlists },
  ShowFilter,
  ShowSort,
  ShowPlaylists,
  OwnedPlaylists,
  ownedPlaylists,
}) => {
  const [open, setOpen] = useState({
    select: false,
    filter: false,
    sort: false,
  });
  const [option, setOption] = useState('Playlists');
  const [filter, setFilter] = useState({
    owned: false,
  });

  useEffect(() => {
    ShowPlaylists();
  }, []);

  const handleClick = (e, value) => {
    e.preventDefault();
    setOption(value);
    setOpen({ ...open, select: false });
  };

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const filterItems = (
    <ul>
      <li>
        <form>
          <input
            type='checkbox'
            name='owned'
            value='owned'
            checked={ownedPlaylists}
            onChange={OwnedPlaylists}
            defaultChecked={false}
          />{' '}
          <label for='owned'>Playlist I Created</label>
        </form>
      </li>
    </ul>
  );

  const sortItems = (
    <ul>
      <li>
        <form>
          <input
            type='checkbox'
            name='sort'
            value='sort'
            checked={ownedPlaylists}
            onChange={OwnedPlaylists}
            defaultChecked={false}
            className='sort-checkbox'
          />{' '}
          <label for='sort' className='sort-checkbox'>
            Playlist I Created
          </label>
        </form>
      </li>
    </ul>
  );

  const selectItems = (
    <ul>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'Playlists')}>
          Playlists
        </a>
      </li>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'Artists')}>
          Artists
        </a>
      </li>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'Genres')}>
          Genres
        </a>
      </li>
    </ul>
  );

  return (
    <Fragment>
      <nav className={hidden ? 'hidden' : 'sidebar'}>
        <span className='sidebar-menu'>
          <span
            className='sidebar-menu-select'
            onMouseOver={() => setOpen({ ...open, filter: true })}
            onMouseLeave={() => setOpen({ ...open, filter: false })}
          >
            <FilterIcon
              className='svg filter-icon playlists'
              ref={filterRef}
              onClick={ShowFilter}
            />
            <SlideDown className='filter-slidedown overlay'>
              {open.filter ? filterItems : null}
            </SlideDown>
          </span>
          <span
            className='sidebar-menu-select'
            onMouseOver={() => setOpen({ ...open, select: true })}
            onMouseLeave={() => setOpen({ ...open, select: false })}
          >
            <p
              className={`sidebar-menu-title filter-btn ${option.toLowerCase()}`}
            >
              {option}
            </p>
            <SlideDown className='select-slidedown overlay'>
              {open.select ? selectItems : null}
            </SlideDown>
          </span>
          <span
            className='sidebar-menu-select'
            onMouseOver={() => setOpen({ ...open, sort: true })}
            //onMouseLeave={() => setOpen({ ...open, sort: false })}
          >
            <SortIcon
              className='svg filter-icon genres'
              ref={sortRef}
              onClick={ShowSort}
            ></SortIcon>
            <SlideDown className='sort-slidedown overlay'>
              {open.sort ? sortItems : null}
            </SlideDown>
          </span>
        </span>

        {loading ? (
          <Loader />
        ) : (
          <div className='sidebar-item-list'>
            {option === 'Playlists' ? <Playlists /> : null}
            {option === 'Artists' ? <Artists /> : null}
            {option === 'Genres' ? <Genres /> : null}
          </div>
        )}
      </nav>
    </Fragment>
  );
};

Sidebar.propTypes = {
  CloseFilter: PropTypes.func.isRequired,
  CloseSort: PropTypes.func.isRequired,
  ShowFilter: PropTypes.func.isRequired,
  ShowSort: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  playlist: state.playlist,
  showPlaylists: state.filter.showPlaylists,
  showArtists: state.filter.showArtists,
  showGenres: state.filter.showGenres,
  ownedPlaylists: state.filter.ownedPlaylists,
});

const mapDispatchToProps = (dispatch) => ({
  ShowPlaylists: () => {
    dispatch({ type: CLEAR_TRACKS });
    dispatch({ type: SHOW_PLAYLISTS });
  },
  OwnedPlaylists: () => {
    dispatch({ type: OWNED_PLAYLISTS });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
