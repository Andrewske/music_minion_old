import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import DropdownPage from '../dropdown/DropdownPage';
import { DropdownItem } from '../dropdown/DropdownItem';

const SortMenu = ({ activeMenu, setActiveMenu, calcHeight }) => {
  return (
    <Fragment>
      <DropdownPage
        menuName='main'
        title='Sort'
        activeMenu={activeMenu}
        calcHeight={calcHeight}
      >
        <DropdownItem
          name='Date'
          goToMenu='date'
          icon='right'
          setActiveMenu={setActiveMenu}
        ></DropdownItem>
      </DropdownPage>
    </Fragment>
  );
};

SortMenu.propTypes = {};

export default SortMenu;
