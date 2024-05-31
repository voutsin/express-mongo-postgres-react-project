// FIND 
export const findAllUsersSQL = 'SELECT * FROM users';
export const findByUserNameAndPassword = 'SELECT * FROM users WHERE username = $1 AND password_hash = $2';
export const findByEmail = 'SELECT * FROM users WHERE email = $1';
export const findByUserName = 'SELECT * FROM users WHERE username = $1';

// INSERT
export const insertNewUser = `INSERT INTO users (
    username,
    email,
    password_hash,
    created_at,
    profile_pic,
    displayed_name,
    description
) VALUES ($1, $2, $3, $4, $5, $6, $7)`;