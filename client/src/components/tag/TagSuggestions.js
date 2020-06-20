import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addTrackTag } from '../../actions/tags';
import { CSSTransition } from 'react-transition-group';
import { DropdownItem } from '../dropdown/DropdownItem';

const _ = require('lodash');

const TagSuggestions = ({
  activeMenu,
  setActiveMenu,
  calcHeight,
  track_id,
  tracks,
  track_tags,
  setAddTag,
}) => {
  const track =
    tracks.filter((track) => track.track_id === track_id)[0] || false;
  track_tags = track_tags.map((tag) => tag.name) || [];
  const tag_sugg = (track.tag_sugg && track.tag_sugg.lastFm) || [
    { name: 'No tag suggestions' },
  ];
  const tags = tag_sugg
    ? tag_sugg.filter((tag) => !track_tags.includes(_.snakeCase(tag.name)))
    : [];
  const [tagData, setTagData] = useState({
    start: 0,
    end: tags.length > 5 ? 5 : tags.length || null,
    tagGroups: [],
  });

  useEffect(() => {
    tags &&
      tagData.tagGroups.length === 0 &&
      setTagData({ ...tagData, tagGroups: _.chunk(tags, 5) });
  }, [setTagData, tags, tagData]);

  const onClick = (e) => {
    e.preventDefault();
    setAddTag(e.target.id);
  };
  return (
    <Fragment>
      {tagData.tagGroups.map((tags, index) => (
        <CSSTransition
          in={activeMenu === _.toString(index)}
          unmountOnExit
          timeout={500}
          classNames='menu-secondary'
          onEnter={calcHeight}
        >
          <div className='menu'>
            <DropdownItem
              goToMenu={activeMenu > 0 ? _.toString(index - 1) : 'main'}
              setActiveMenu={setActiveMenu}
              name='Back'
              icon='left'
            />
            {tags.map((tag) => (
              <span id={tag.name} onClick={(e) => onClick(e)}>
                <DropdownItem
                  goToMenu={'tagTypes'}
                  setActiveMenu={setActiveMenu}
                  name={_.snakeCase(tag.name)}
                  id={_.snakeCase(tag.name)}
                />
              </span>
            ))}

            <DropdownItem
              goToMenu={
                _.toInteger(activeMenu) < tagData.tagGroups.length - 1
                  ? _.toString(index + 1)
                  : '0'
              }
              setActiveMenu={setActiveMenu}
              name='More'
              icon='right'
            />
          </div>
        </CSSTransition>
      ))}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag })(TagSuggestions);
