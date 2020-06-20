import React, { Fragment } from 'react';
import { ReactComponent as Back } from '../../img/back.svg';
import { ReactComponent as Next } from '../../img/next.svg';

export const DropdownItem = ({
  goToMenu,
  setActiveMenu,
  name,
  icon,
  input = false,
  id = null,
}) => {
  return (
    <Fragment>
      {input && input}
      {name && (
        <button
          href='#'
          className='menu-item'
          id={id}
          onClick={() => goToMenu && setActiveMenu(goToMenu)}
        >
          {icon === 'left' && (
            <Back
              className='svg icon-button'
              style={{ fill: 'white', padding: '2px' }}
            />
          )}
          {name}
          {icon === 'right' && (
            <Next
              className='svg icon-button'
              style={{ fill: 'white', padding: '2px' }}
            />
          )}
        </button>
      )}
    </Fragment>
  );
};
