import React, { Fragment } from 'react';

const Loader = (props) => {
  const bars = [];
  for (var i = 0; i < 10; i++) {
    bars.push(<div key={i} className='bar'></div>);
  }
  return (
    <Fragment>
      <div id='loading-container'>
        {/*<!--Thanks to El Alemano https://codepen.io/elalemanyo/pen/wueft-->*/}
        <div id='bars'>{bars}</div>
        <p id='loading-text' class='hidden'></p>
      </div>
    </Fragment>
  );
};

export default Loader;
