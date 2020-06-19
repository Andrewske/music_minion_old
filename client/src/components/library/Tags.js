import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTrackTag, removeTrackTag } from '../../actions/tags';
import Popup from 'reactjs-popup';
import TagSuggestions from './TagSuggestions';
import DropdownMenu from './DropdownMenu';
import AddTagButton from './AddTagButton';
import TagBox from './TagBox';
import TagItem from './TagItem';

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
        console.log(`removing ${tag}`);
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

  const addSuggestion = (tag) => {
    addTrackTag(tag, track_id, user_id);
    setTagData({ tag: '', tags: [...tags, tag] });
  };

  let { tag, tags, addTag } = tagData;

  return (
    <TagBox>
      {tags &&
        tags.map((tag) => (
          <TagItem key={tag.name} name={tag.name} color={tag.type} />
        ))}
      <TagItem name='Dubstep_2020_yeaaaaaaa' />
      <TagItem name='Brostep' />
      <TagItem name='2020'>
        <DropdownMenu></DropdownMenu>
      </TagItem>
      <TagItem icon='plus'>
        <DropdownMenu></DropdownMenu>
      </TagItem>
    </TagBox>
    // <div className='tag-box'>
    //   <ul className='tag-box-tags'>
    //     {tags &&
    //       tags.map((tag) => (
    //         <li key={tag.name} className={`tag-item ${tag.type}`}>
    //           <p className={`tag-text`}>#{tag.name}</p>
    // <i
    //   className='icon material-icons cancel'
    //   id={tag.tag_id}
    //   title='removeTag'
    //   style={{ cursor: 'pointer' }}
    //   onClick={(e) => onClick(e)}
    // >
    //   cancel
    // </i>
    //         </li>
    //       ))}
    //     <AddTagButton>
    //       <DropdownMenu />
    //     </AddTagButton>
    //   </ul>

    //   {/* {!addTag && (
    //     <span
    //       id='add-tag'
    //       style={{ cursor: 'pointer', color: '#05FFFF' }}
    //       onClick={(e) => onClick(e)}
    //       className='tag-input'
    //     >
    //       Add a tag
    //     </span>
    //   )} */}
    //   {/* {addTag && (
    //     <form onSubmit={(e) => onSubmit(e)}>
    //       <input
    //         type='text'
    //         placeholder='#tag'
    //         title='addTag'
    //         name='tag'
    //         value={tag}
    //         className='tag-input'
    //         style={{ width: '100px' }}
    //         onChange={(e) => onChange(e)}
    //         autoFocus
    //       />
    //     </form>
    //   )} */}

    //   {/* <Popup
    //     trigger={
    //       <i
    //         className='icon material-icons'
    //         title='tagSuggestions'
    //         style={{ cursor: 'pointer' }}
    //         //onClick={(e) => onClick(e)}
    //       >
    //         add
    //       </i>
    //     }
    //     position='top center'
    //     closeOnDocumentClick
    //   >
    //     <TagSuggestions
    //       action={addSuggestion}
    //       track_id={track_id}
    //       track_tags={tagData.tags}
    //     />
    //   </Popup> */}
    // </div>
  );
};

const mapStateToProps = (state) => ({
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag, removeTrackTag })(Tags);
