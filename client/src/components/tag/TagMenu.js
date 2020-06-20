import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { DropdownItem } from '../dropdown/DropdownItem';
import TagSuggestions from './TagSuggestions';
import AddTagInput from './AddTagInput';
import TagTypes from './TagTypes';

const TagMenu = ({
  activeMenu,
  setActiveMenu,
  calcHeight,
  track_id,
  tracks,
  tagData,
  setTagData,
  user_id,
  setOpen,
}) => {
  const [addTag, setAddTag] = useState({
    tag: '',
    type: '',
  });
  return (
    <Fragment>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames='menu-primary'
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className='menu'>
          <div className='menu-header'>
            <p className='menu-title'>Add a tag:</p>
          </div>

          <DropdownItem
            input={
              <AddTagInput
                tagData={tagData}
                setTagData={setTagData}
                setAddTag={setAddTag}
                goToMenu='tagTypes'
                setActiveMenu={setActiveMenu}
              />
            }
          />
          <DropdownItem
            name='Suggestions'
            goToMenu='0'
            icon='right'
            setActiveMenu={setActiveMenu}
          ></DropdownItem>
        </div>
      </CSSTransition>

      <TagSuggestions
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        calcHeight={calcHeight}
        track_id={track_id}
        track_tags={tagData.tags}
        setAddTag={setAddTag}
      />

      <TagTypes
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        calcHeight={calcHeight}
        addTag={addTag}
        track_id={track_id}
        user_id={user_id}
        tagData={tagData}
        setTagData={setTagData}
        setOpen={setOpen}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, null)(TagMenu);
