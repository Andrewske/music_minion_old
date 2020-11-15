CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET client_encoding TO 'UTF8';

/* MAIN TABLES */
CREATE TABLE users (
    user_id UUID NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    google_id TEXT,
    google_img_url TEXT,
    spotify_id TEXT,
    spotify_img_url TEXT,
    UNIQUE(email)
);

CREATE TABLE user_token (
    token_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_in INTEGER NOT NULL DEFAULT 3600,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    platform TEXT NOT NULL,
    PRIMARY KEY (token_id, user_id)
);

CREATE TABLE playlist (
    playlist_id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    img_url TEXT,
    size INTEGER,
    platform TEXT,
    snapshot_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE track (
    track_id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    popularity INTEGER,
    release_date DATE,
    tag_sugg JSONB,
);

CREATE TABLE artist (
    artist_id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    followers INTEGER,
    img_url TEXT,
    popularity INTEGER
);

CREATE TABLE tag (
    tag_id BIGSERIAL NOT NULL PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL,
    source text NOT NULL,
    UNIQUE (name, type)
);

CREATE TABLE audio_features (
    track_id TEXT NOT NULL REFERENCES track(track_id),
    duration_ms INTEGER,
    track_key INTEGER,
    mode INTEGER,
    time_signature INTEGER,
    acousticness DECIMAL,
    danceability DECIMAL,
    energy DECIMAL,
    instrumentalness DECIMAL,
    liveness DECIMAL,
    loudness DECIMAL,
    speechiness DECIMAL,
    valence DECIMAL,
    tempo DECIMAL,
    UNIQUE(track_id)
);


/* Many to Many Connections */
CREATE TABLE user_playlist (
    user_playlist_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES users(user_id),
    playlist_id TEXT REFERENCES playlist(playlist_id),
    owner BOOLEAN,
    UNIQUE (user_id, playlist_id)
);

CREATE TABLE artist_track (
    artist_track_id BIGSERIAL NOT NULL,
    artist_id TEXT REFERENCES artist(artist_id),
    track_id TEXT REFERENCES track(track_id),
    UNIQUE(artist_id, track_id)
);


CREATE TABLE playlist_track (
    playlist_track_id BIGSERIAL NOT NULL,
    playlist_id TEXT REFERENCES playlist(playlist_id),
    track_id TEXT REFERENCES track(track_id),
    added_at DATE,
    UNIQUE (playlist_id, track_id)
);

CREATE TABLE user_track (
    user_track_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES users(user_id),
    track_id TEXT REFERENCES track(track_id),
    added_at DATE,
    UNIQUE (user_id, track_id)
);

CREATE TABLE user_artist (
    user_artist_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES users(user_id),
    artist_id TEXT REFERENCES artist(artist_id),
    following BOOLEAN,
    UNIQUE (user_id, artist_id)
);


CREATE TABLE user_tag (
    user_tag_id BIGSERIAL NOT NULL,
    user_id UUID REFERENCES users(user_id),
    tag_id BIGSERIAL REFERENCES tag(tag_id),
    UNIQUE (user_id, tag_id)
);


CREATE TABLE playlist_tag (
    playlist_tag_id BIGSERIAL NOT NULL,
    playlist_id TEXT NOT NULL REFERENCES playlist(playlist_id),
    user_id UUID REFERENCES users(user_id),
    tag_id BIGSERIAL NOT NULL REFERENCES tag(tag_id),
    UNIQUE (playlist_id, tag_id)
);

CREATE TABLE track_tag (
    track_tag_id BIGSERIAL NOT NULL,
    track_id TEXT NOT NULL REFERENCES track(track_id),
    user_id UUID REFERENCES users(user_id),
    tag_id BIGSERIAL NOT NULL REFERENCES tag(tag_id),
    UNIQUE (track_id, tag_id, user_ud)
);

CREATE TABLE artist_tag (
    artist_tag_id BIGSERIAL NOT NULL,
    artist_id TEXT NOT NULL REFERENCES artist(artist_id) ,
    user_id UUID REFERENCES users(user_id),
    tag_id BIGSERIAL NOT NULL REFERENCES tag(tag_id),
    UNIQUE (artist_id, tag_id)
);