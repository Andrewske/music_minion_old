import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { DropdownItem } from '../dropdown/DropdownItem';
import { addTrackTag } from '../../actions/tags';

const TagTypes = ({
  activeMenu,
  calcHeight,
  setActiveMenu,
  addTag,
  tagData,
  setTagData,
  track_id,
  user_id,
  setOpen,
}) => {
  const onClick = (e) => {
    console.log(e.target);
    let tag = { type: e.target.id, name: addTag };
    console.log(tag);
    addTrackTag(tag, track_id, user_id);
    setTagData({ tag: '', tags: [...tagData.tags, tag] });
    setOpen(false);
  };

  return (
    <CSSTransition
      in={activeMenu === 'tagTypes'}
      timeout={500}
      classNames='menu-primary'
      unmountOnExit
      onEnter={calcHeight}
    >
      <div className='menu'>
        <DropdownItem
          goToMenu={'main'}
          setActiveMenu={setActiveMenu}
          name='Back'
          icon='left'
        />
        <span onClick={(e) => onClick(e)}>
          <DropdownItem name='Genre' id='genre' color='genre' />
        </span>
        <span onClick={(e) => onClick(e)}>
          <DropdownItem name='Playlist' id='playlist' />
        </span>
        <span onClick={(e) => onClick(e)}>
          <DropdownItem name='Misc' id='misc' />
        </span>
      </div>
    </CSSTransition>
  );
};

export default TagTypes;
