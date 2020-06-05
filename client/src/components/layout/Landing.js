import React from 'react';
import SpotifyLoginButton from '../auth/SpotifyLoginButton';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Music Minion</h1>
          <p className='lead'>
            Organize your Music Library with Tags. Discover New Music. Explore
            your library through data visualizations.
          </p>
          <div className='buttons'>
            <SpotifyLoginButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
