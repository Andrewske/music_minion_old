import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTrackTag, removeTrackTag } from '../../actions/tags';
import TagBox from './TagBox';
import TagItem from './TagItem';

export const Tags = ({
  user_id,
  track_id,
  removeTrackTag,
  track_tags = [],
}) => {
  const [tagData, setTagData] = useState({
    tag: '',
    tags: track_tags,
    addTag: false,
  });

  const removeTag = (e, tagId) => {
    let tag = tags.filter((tag) => tag.tag_id === tagId)[0];
    removeTrackTag({ tag, track_id, user_id });
    return setTagData({
      ...tagData,
      tags: tags.filter((t) => t !== tag),
    });
  };

  let { tags } = tagData;

  return (
    <TagBox>
      <TagItem
        icon='plus'
        tagData={tagData}
        setTagData={setTagData}
        track_id={track_id}
        key='icon'
      />
      {tags &&
        tags.map((tag) => (
          <TagItem
            removeTag={removeTag}
            tagId={tag.tag_id}
            key={tag.tag_id}
            name={tag.name}
            color={tag.type}
          />
        ))}
    </TagBox>
  );
};

const mapStateToProps = (state) => ({
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag, removeTrackTag })(Tags);
