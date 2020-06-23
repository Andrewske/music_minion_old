import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DropdownPage from '../dropdown/DropdownPage';
import { DropdownItem } from '../dropdown/DropdownItem';
import { OWNED_PLAYLISTS } from '../../actions/types';

const FilterMenu = ({
  activeMenu,
  setActiveMenu,
  calcHeight,
  OwnedPlaylists,
}) => {
  return (
    <Fragment>
      <DropdownPage
        menuName='main'
        title='Filters'
        activeMenu={activeMenu}
        calcHeight={calcHeight}
      >
        <DropdownItem
          input={
            <label>
              <input
                type='checkbox'
                id='ownedPlaylists'
                value='owned'
                onChange={OwnedPlaylists}
              ></input>{' '}
              Playlists I Own
            </label>
          }
        ></DropdownItem>
      </DropdownPage>
    </Fragment>
  );
};

FilterMenu.propTypes = {};

const mapDispatchToProps = (dispatch) => ({
  OwnedPlaylists: () => {
    dispatch({ type: OWNED_PLAYLISTS });
  },
});

export default connect(null, mapDispatchToProps)(FilterMenu);
