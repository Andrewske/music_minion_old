import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as Back } from '../../img/back.svg';
import { ReactComponent as Next } from '../../img/next.svg';

const DropdownPage = ({
  menuName,
  title,
  activeMenu,
  setActiveMenu,
  calcHeight,
  classNames = 'menu-primary',
  showPrev,
  showNext,
  ...props
}) => {
  return (
    <CSSTransition
      in={activeMenu === menuName}
      timeout={0}
      classNames={classNames}
      unmountOnExit
      onEnter={calcHeight}
    >
      <div className='menu'>
        <div className='menu-header'>
          <p className='menu-title'>{title}</p>
        </div>
        <span style={{ display: 'flex', flexWrap: 'no-wrap' }}>
          <button
            style={{ display: showPrev ? 'flex' : 'none' }}
            onClick={() => setActiveMenu(showPrev)}
            className='menu-btn'
          >
            <Back
              className='svg icon-button'
              style={{ fill: 'white', padding: '2px' }}
            />
            Back
          </button>
          <button
            onClick={() => setActiveMenu(showNext)}
            style={{ display: showNext ? 'flex' : 'none' }}
            className='menu-btn'
          >
            Next{' '}
            <Next
              className='svg icon-button'
              style={{ fill: 'white', padding: '2px' }}
            />
          </button>
        </span>
        {props.children}
      </div>
    </CSSTransition>
  );
};

DropdownPage.propTypes = {};

export default DropdownPage;
