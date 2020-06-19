import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import { addTrackTag } from '../../actions/tags';

const _ = require('lodash');

const TagSuggestions = ({ user_id, track_id, tracks, track_tags, action }) => {
  const track =
    tracks.filter((track) => track.track_id === track_id)[0] || false;
  track_tags = track_tags.map((tag) => tag.name) || [];
  const tag_sugg = track.tag_sugg.lastFm || null;
  const tags = tag_sugg
    ? tag_sugg.filter((tag) => !track_tags.includes(_.snakeCase(tag.name)))
    : [];
  const [tagData, setTagData] = useState({
    start: 0,
    end: tags.length > 5 ? 5 : tags.length || null,
  });

  const onClick = (e) => {
    e.preventDefault();
    switch (e.target.title) {
      case 'next':
        if (tagData.end < tags.length) {
          return setTagData({ start: tagData.start + 1, end: tagData.end + 1 });
        }
        break;
      case 'previous':
        if (tagData.start > 0) {
          return setTagData({ start: tagData.start - 1, end: tagData.end - 1 });
        }
        break;
      case 'genre':
        return action({ name: e.target.value, type: 'genre' });
      case 'misc':
        return action({ name: e.target.value, type: 'misc' });
    }
  };
  return (
    tags && (
      <div className='tag-box'>
        {tagData.start > 0 && (
          <i
            className='icon material-icons'
            style={{ cursor: 'pointer' }}
            title='previous'
            onClick={(e) => onClick(e)}
          >
            keyboard_arrow_left
          </i>
        )}
        {tags.slice(tagData.start, tagData.end).map((tag) => (
          <div key={tag.name} className='tag'>
            <p className={`tag-text`}>#{_.snakeCase(tag.name)}</p>
            <div className='popup'>
              <Popup
                trigger={
                  <i
                    className='icon material-icons cancel'
                    //id={tag.tag_id}
                    title='addTag'
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => onClick(e)}
                  >
                    add
                  </i>
                }
                position='top center'
                closeOnDocumentClick
              >
                {(close) => (
                  <form className='popup-selections'>
                    <button
                      className='popup-button'
                      title='genre'
                      value={_.snakeCase(tag.name)}
                      onClick={(e) => {
                        close();
                        onClick(e);
                      }}
                    >
                      genre
                    </button>
                    <button
                      className='popup-button'
                      title='misc'
                      value={_.snakeCase(tag.name)}
                      onClick={(e) => {
                        close();
                        onClick(e);
                      }}
                    >
                      misc
                    </button>
                  </form>
                )}
              </Popup>
            </div>
          </div>
        ))}
        {tagData.end < tags.length && (
          <i
            className='icon material-icons'
            title='next'
            style={{ cursor: 'pointer' }}
            onClick={(e) => onClick(e)}
          >
            keyboard_arrow_right
          </i>
        )}
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  tracks: state.library.tracks,
  user_id: state.auth.user.user_id,
});

export default connect(mapStateToProps, { addTrackTag })(TagSuggestions);
