import React, { useState, useRef, useEffect } from 'react';
import TagMenu from '../tag/TagMenu';

// Thanks to Fireship for Dropdown Tutorial https://www.youtube.com/watch?v=IF6k0uZuypA

const DropdownMenu = (props) => {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      <div
        className='dropdown'
        ref={dropdownRef}
        style={{ height: menuHeight }}
      >
        <TagMenu
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          calcHeight={calcHeight}
          track_id={props.track_id}
          tagData={props.tagData}
          setTagData={props.setTagData}
          setOpen={props.setOpen}
        />
      </div>
    </div>
  );
};

export default DropdownMenu;
