import React, { useState, Fragment } from 'react';
import { ReactComponent as AddIcon } from '../../img/plus.svg';
import { ReactComponent as CancelIcon } from '../../img/cancel.svg';

const TagItem = (props) => {
  const [open, setOpen] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <li className={`tag-item`} key={props.key}>
      {props.icon && (
        <button onClick={(e) => onClick(e)}>
          <AddIcon className='svg icon-button' />
        </button>
      )}
      {props.name && (
        <Fragment>
          <button
            className={`tag-button ${props.color}`}
            onClick={(e) => onClick(e)}
          >
            #{props.name}
            <CancelIcon className='svg icon-button' />
          </button>
        </Fragment>
      )}

      {open && props.children}
    </li>
  );
};

export default TagItem;
