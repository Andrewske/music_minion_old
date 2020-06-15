import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTrackTag, removeTrackTag } from '../../actions/tags';
import styled from 'styled-components';

const _ = require('lodash');

export const Tags = ({
  user_id,
  track_id,
  addTrackTag,
  removeTrackTag,
  track_tags = [],
}) => {
  const [tagData, setTagData] = useState({
    tag: '',
    tags: track_tags,
    addTag: false,
  });

  const onClick = (e) => {
    console.log(e.target.title);
    switch (e.target.title) {
      case 'addTag':
        return setTagData({ ...tagData, addTag: true });
      case 'removeTag':
        let tag = tags.filter((tag) => tag.tag_id === e.target.id)[0];
        removeTrackTag({ tag, track_id, user_id });
        return setTagData({
          ...tagData,
          tags: tags.filter((t) => t !== tag),
        });
    }
  };

  const onChange = (e) => {
    setTagData({ ...tagData, tag: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      let [type, name] = tag.split(':');

      if (!name) {
        name = type;
        type = 'misc';
      }
      tag = { type, name: _(name).snakeCase() };
    } catch (err) {
      tag = { type: 'misc', name: _(tag).snakeCase() };
    }

    addTrackTag(tag, track_id, user_id);
    setTagData({ tag: '', tags: [...tags, tag] });
  };

  let { tag, tags, addTag } = tagData;

  return (
    <div className='tag-box'>
      {tags &&
        tags.map((tag) => (
          <div key={tag.name} className={`tag ${tag.type}`}>
            <p className={`tag-text`}>#{tag.name}</p>
            <i
              className='icon material-icons cancel'
              id={tag.tag_id}
              title='removeTag'
              style={{ cursor: 'pointer' }}
              onClick={(e) => onClick(e)}
            >
              cancel
            </i>
          </div>
        ))}
      {!addTag && (
        <span
          id='add-tag'
          style={{ cursor: 'pointer', color: '#05FFFF' }}
          onClick={(e) => onClick(e)}
          className='tag-input'
        >
          Add a tag
        </span>
      )}
      {addTag && (
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type='text'
            placeholder='#tag'
            title='addTag'
            name='tag'
            value={tag}
            className='tag-input'
            style={{ width: '100px' }}
            onChange={(e) => onChange(e)}
            autoFocus
          />
        </form>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag, removeTrackTag })(Tags);
