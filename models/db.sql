CREATE DATABASE music_minion;

CREATE TABLE users (
    user_id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    google_id VARCHAR(150),
    google_img_url VARCHAR(150),
    spotify_id VARCHAR(150),
    spotify_img_url VARCHAR(250),
    UNIQUE(email)
);

CREATE TABLE user_token (
    token_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    expires_in INTEGER NOT NULL DEFAULT 3600,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    platform VARCHAR(50) NOT NULL,
    PRIMARY KEY (token_id, user_id)
);

CREATE TABLE playlist (
    playlist_id VARCHAR(150) NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    owner VARCHAR(150) NOT NULL,
    img_url VARCHAR(500),
    size INTEGER,
    platform TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE user_playlist (
    user_playlist_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES users(user_id),
    playlist_id VARCHAR(150) REFERENCES playlist(playlist_id),
    UNIQUE (user_id, playlist_id)
);

CREATE TABLE track (
    track_id VARCHAR(150) NOT NULL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    img_url VARCHAR(500),

)

CREATE TABLE artist (
    artist_id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(150),
)

CREATE TABLE artist_track (
    artist_track_id BIGSERIAL NOT NULL,
    artist_id INTEGER REFERENCES artist(artist_id),
    track_id VARCHAR(150) REFERENCES track(track_id),
    UNIQUE(artist_id, track_id)
)


CREATE TABLE playlist_track (
    playlist_track_id BIGSERIAL NOT NULL,
    playlist_id VARCHAR(150) REFERENCES playlist(playlist_id),
    track_id VARCHAR(150) REFERENCES track(track_id),
    UNIQUE (playlist_id, track_id)
)

CREATE TABLE user_track (
    user_track_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES user(user_id),
    track_id VARCHAR(150) REFERENCES track(track_id)
)