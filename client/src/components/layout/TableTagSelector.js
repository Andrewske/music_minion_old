import React, { useState, useEffect, useRef } from 'react';
import { SlideDown } from 'react-slidedown';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const TableTagSelector = ({ setTagSelection, tagSelection }) => {
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState('Genre Tags');
  const clickRef = useRef();

  const tagsTooltip = `Tags can be set for different types. They should be seperated by a comma. Multi word phrased will be turned to snake case, i.e 1980s hits = 1980s_hits`;

  useEffect(() => {
    if (tagSelection === 'genre') {
      setHeader('Genre Tags');
    }
    if (tagSelection === 'playlist') {
      setHeader('Playlist Tags');
    }
    if (tagSelection === 'misc') {
      setHeader('Other Tags');
    }
  }, [tagSelection]);

  useEffect(() => {
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('click', clickOutside);
    };
  });

  const clickOutside = (e) => {
    if (clickRef.current && !clickRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleClick = (e, value = null) => {
    e.preventDefault();
    if (value) {
      setTagSelection(value);
    }
  };

  const tagSelections = (
    <ul>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'genre')}>
          Genre
        </a>
      </li>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'playlist')}>
          Playlist
        </a>
      </li>
      <li>
        <a href='/#' onClick={(e) => handleClick(e, 'misc')}>
          Other
        </a>
      </li>
    </ul>
  );

  return (
    <span
      className='table-slidedown-span'
      onClick={() => setOpen(!open)}
      ref={clickRef}
    >
      <span>
        <p>
          {header}{' '}
          {open ? (
            <i className='fa fa-angle-up fa-xs'></i>
          ) : (
            <i className='fa fa-angle-down fa-xs'></i>
          )}
        </p>
        {open && (
          <SlideDown className='table-slidedown overlay'>
            {tagSelections}
          </SlideDown>
        )}
      </span>
      <i className='fa fa-info-circle fa-xs' data-tip={tagsTooltip}>
        <ReactTooltip />
      </i>
    </span>
  );
};

TableTagSelector.propTypes = {
  setTagSelection: PropTypes.func.isRequired,
};

export default TableTagSelector;
