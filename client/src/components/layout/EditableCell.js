import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addTrackTag } from '../../actions/tags';

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
    let track_id = cell.row.values.track_id;
    let tags = value.split(',').map((tag) => _.lowerCase(tag));
    let original_tags = tracks.find((track) => track.track_id === track_id)
      .tags;
    let new_tags = _.difference(tags, original_tags);
    let remove_tags = _.difference(original_tags, tags);
    console.log(new_tags);
    new_tags.map((tag) => {
      console.log(tag);
      return addTrackTag({ type: 'genre', name: tag }, track_id, user_id);
    });

    console.log(new_tags, remove_tags);
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
      <input value={value} onChange={onChange} onBlur={onBlur} />
    </form>
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps)(EditableCell);
