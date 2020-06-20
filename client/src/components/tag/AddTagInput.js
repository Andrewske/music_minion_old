import React from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');

const AddTagInput = ({
  tagData,
  setTagData,
  setAddTag,
  setActiveMenu,
  goToMenu,
}) => {
  let { tag } = tagData;

  const onChange = (e) => {
    setTagData({ ...tagData, tag: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setAddTag(_(tag).snakeCase());
    setActiveMenu(goToMenu);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input
        type='text'
        placeholder='#tag'
        title='addTag'
        name='tag'
        value={tag}
        className='menu-item'
        onChange={(e) => onChange(e)}
        autoFocus
      />
    </form>
  );
};

AddTagInput.propTypes = {
  tagData: PropTypes.object.isRequired,
  setTagData: PropTypes.func.isRequired,
  setAddTag: PropTypes.func.isRequired,
  setActiveMenu: PropTypes.func.isRequired,
  goToMenu: PropTypes.string.isRequired,
};

export default AddTagInput;
