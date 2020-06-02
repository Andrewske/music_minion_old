CREATE DATABASE music_minion;

CREATE TABLE users (
    user_id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    google_id VARCHAR(150),
    google_img_url VARCHAR(150),
    UNIQUE(email)
);