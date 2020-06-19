import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

const AddTagButton = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <i
        className='icon material-icons'
        title='addTag'
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        add
      </i>

      {open && props.children}
    </Fragment>
  );
};

AddTagButton.propTypes = {};

export default AddTagButton;
