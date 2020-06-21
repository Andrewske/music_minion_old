import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addTrackTag } from '../../actions/tags';
import { DropdownItem } from '../dropdown/DropdownItem';
import DropdownPage from '../dropdown/DropdownPage';

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
  //Get the current track from State and get tag names
  const track =
    tracks.filter((track) => track.track_id === track_id)[0] || false;
  track_tags = track_tags.map((tag) => tag.name) || [];

  //Get the tag suggestions
  const tag_sugg =
    track.tagg_sugg && track.tag_sugg.lastFm.length > 0
      ? track.tag_sugg.lastFm
      : null;

  // Filter out suggestions that are already tags
  const tags = tag_sugg
    ? tag_sugg.filter((tag) => !track_tags.includes(_.snakeCase(tag.name)))
    : null;

  // Set the tag state for this menu
  const [tagData, setTagData] = useState({
    start: 0,
    end: tags ? (tags.length > 5 ? 5 : tags.length) : null,
    total: tags ? tags.length : null,
    noTags: tags ? false : true,
    tagGroups: tags ? [] : null,
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
      {tagData.noTags && (
        <DropdownPage
          title='Sorry... No Suggestions'
          menuName='0'
          setActiveMenu={setActiveMenu}
          activeMenu={activeMenu}
          calcHeight={calcHeight}
          showPrev='main'
        ></DropdownPage>
      )}
      {!tagData.noTags &&
        tagData.tagGroups.map((tags, index) => {
          let total = tagData.total;
          let pages = tagData.tagGroups.length;
          let viewing = tags.length * (index + 1);
          let next =
            _.toInteger(activeMenu) < tagData.tagGroups.length - 1
              ? _.toString(index + 1)
              : '0';
          return (
            <DropdownPage
              title={`Viewing ${
                index === pages - 1 ? total : viewing
              } of ${total}
            suggestions`}
              menuName={_.toString(index)}
              activeMenu={activeMenu}
              calcHeight={calcHeight}
              classNames='menu-secondary'
              setActiveMenu={setActiveMenu}
              showPrev={activeMenu > 0 ? _.toString(index - 1) : 'main'}
              showNext={next}
            >
              {tags.map((tag) => (
                <span key={tag.name} id={tag.name} onClick={(e) => onClick(e)}>
                  <DropdownItem
                    goToMenu={'tagTypes'}
                    setActiveMenu={setActiveMenu}
                    name={_.snakeCase(tag.name)}
                    id={_.snakeCase(tag.name)}
                  />
                </span>
              ))}
            </DropdownPage>
          );
        })}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag })(TagSuggestions);
