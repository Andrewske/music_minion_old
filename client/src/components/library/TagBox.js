import React from 'react';

const TagBox = (props) => {
  return (
    <div className='tag-box'>
      <ul className='tag-box-tags'>{props.children}</ul>
    </div>
  );
};

export default TagBox;
