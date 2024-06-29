CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255),
    displayed_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    birth_date date,
    active INT NOT NULL DEFAULT 1
);
INSERT INTO users (
    username,
    email,
    password_hash,
    created_at,
    profile_pic,
    displayed_name,
    description
) VALUES (
    'achilleas',
    'achilleas.dodos@gmail.com',
    '1234',
    CURRENT_TIMESTAMP,
    NULL,
    'Achilleas Voutsinos',
    'Master Student'
);

CREATE TABLE friends (
    user_id INTEGER REFERENCES users(id),
    friend_id INTEGER REFERENCES users(id),
    status VARCHAR(20) NOT NULL, -- e.g., pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    media_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_type INT NOT NULL
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_reply INT DEFAULT 0,
    reply_comment_id INTEGER
);

CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id) NULL,
    comment_id INTEGER REFERENCES comments(id) NULL,
    reaction_type VARCHAR(20) NOT NULL, -- e.g., like, love, haha, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
