import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addTrackTag, removeTrackTag } from '../../actions/tags';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  editable,
  tracks,
  user_id,
  cell,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const track_id = cell.row.values.track_id;
    const type = cell.column.id.replace('_tags', '');

    const tags = value
      .split(',')
      .map((tag) => _.trim(_.join(_.split(_.toLower(tag), ' '), '_'), '_'));

    const original_tags = tracks
      .find((track) => track.track_id === track_id)
      .tags.map((tag) => (tag.type === type ? tag.name : null));

    console.log(tags.map((tag) => tag));

    const new_tags = _.difference(tags, original_tags);
    const remove_tags = _.compact(_.difference(original_tags, tags));

    new_tags.map((tag) => {
      return addTrackTag({ type: type, name: tag }, track_id, user_id);
    });

    remove_tags.map((tag) => {
      return removeTrackTag({ type: type, name: tag }, track_id, user_id);
    });

    console.log('done');
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={value} onChange={onChange} onBlur={onBlur} />{' '}
      <span onClick={onSubmit}>
        <i className='fa fa-check fa-xs submit-icon'></i>
      </span>
    </form>
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps)(EditableCell);
