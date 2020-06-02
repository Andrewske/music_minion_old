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