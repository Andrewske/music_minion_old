import React, { useState, useRef, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
//import { DropdownItem } from './DropdownItem';

// Thanks to Fireship for Dropdown Tutorial https://www.youtube.com/watch?v=IF6k0uZuypA

const DropdownMenu = (props) => {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a
        href='#'
        className='menu-item'
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className='svg icon-button'>{props.leftIcon}</span>
        {props.children}
        <span className='icon-right'>{props.rightIcon}</span>
      </a>
    );
  }
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div
        className='dropdown'
        ref={dropdownRef}
        style={{ height: menuHeight }}
      >
        <CSSTransition
          in={activeMenu === 'main'}
          unmountOnExit
          timeout={500}
          classNames='menu-primary'
          onEnter={calcHeight}
        >
          <div className='menu'>
            <DropdownItem>Tag #1</DropdownItem>
            <DropdownItem>Tag #2</DropdownItem>
            <DropdownItem goToMenu='suggestions'>Suggestions</DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'suggestions'}
          unmountOnExit
          timeout={500}
          classNames='menu-secondary'
          onEnter={calcHeight}
        >
          <div className='menu'>
            <DropdownItem>Tag #1</DropdownItem>
            <DropdownItem>Tag #2</DropdownItem>
            <DropdownItem goToMenu='main'>
              <i
                className='icon material-icons cancel'
                style={{ cursor: 'pointer', alignSelf: 'flex-start' }}
              >
                keyboard_arrow_left
              </i>{' '}
              Back
            </DropdownItem>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

DropdownMenu.propTypes = {};

export default DropdownMenu;
