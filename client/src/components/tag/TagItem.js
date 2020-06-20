import React, { useState, Fragment, useRef, useEffect } from 'react';
import { ReactComponent as AddIcon } from '../../img/plus.svg';
import { ReactComponent as CancelIcon } from '../../img/close.svg';
import DropdownMenu from '../dropdown/DropdownMenu';

const TagItem = ({
  removeTag,
  tagId,
  tagData,
  setTagData,
  track_id,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case 'dropdown':
        setOpen(!open);
        break;
      case 'cancel':
        removeTag(e, tagId);
        break;
      default:
        return;
    }
  };

  const handleClickOutside = (e) => {
    if (itemRef.current && !itemRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <li key={tagId} className={`tag-item`} ref={itemRef}>
      {props.icon && (
        <AddIcon
          className='svg icon-button'
          id='dropdown'
          onClick={(e) => onClick(e)}
        />
      )}
      {props.name && (
        <Fragment>
          <button className={`tag-button ${props.color}`}>
            <span id='dropdown' onClick={(e) => onClick(e)}>
              #{props.name}
            </span>
            <CancelIcon
              className='svg icon-button'
              onClick={(e) => onClick(e)}
              id='cancel'
            />
          </button>
        </Fragment>
      )}

      {open && (
        <DropdownMenu
          menu='tagMenu'
          track_id={track_id}
          tagData={tagData}
          setTagData={setTagData}
          setOpen={setOpen}
        />
      )}
    </li>
  );
};

export default TagItem;
