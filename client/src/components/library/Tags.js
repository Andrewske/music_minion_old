import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTrackTag } from '../../actions/tags';

const _ = require('lodash');

export const Tags = ({ user_id, track_id, addTrackTag, track_tags = [] }) => {
  const [tagData, setTagData] = useState({
    tag: '',
    tags: track_tags,
    addTag: false,
  });

  const onClick = (e) => {
    setTagData({ ...tagData, addTag: true });
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
      console.log(type);
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
          <span key={tag.name} className={`tag ${tag.type}`}>
            <i className='icon material-icons hashtag'>#</i>
            <p className={`tag-text`}>{tag.name}</p>
            <i className='icon material-icons cancel'>cancel</i>
          </span>
        ))}
      {!addTag && (
        <span
          id='add-tag'
          style={{ cursor: 'pointer', color: '#05FFFF' }}
          onClick={(e) => onClick(e)}
        >
          Add a tag
        </span>
      )}
      {addTag && (
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type='text'
            placeholder='#tag'
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

export default connect(mapStateToProps, { addTrackTag })(Tags);
