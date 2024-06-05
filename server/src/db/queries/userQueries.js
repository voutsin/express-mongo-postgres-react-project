// FIND 
export const findAllUsersSQL = 'SELECT * FROM users;';
export const findByUserNameAndPassword = 'SELECT * FROM users WHERE username = $1 AND password_hash = $2;';
export const findByEmail = 'SELECT * FROM users WHERE email = $1;';
export const findOtherUsersByEmail = 'SELECT * FROM users WHERE email = $1 AND username <> $2;';
export const findByUserName = 'SELECT * FROM users WHERE username = $1;';
export const findUserById = 'SELECT * FROM users WHERE id = $1;';

// INSERT
export const insertNewUser = `INSERT INTO users (
    username,
    email,
    password_hash,
    created_at,
    profile_pic,
    displayed_name,
    description
) VALUES ($1, $2, $3, $4, $5, $6, $7);`;

// UPDATE
export const updateUserSQL = `UPDATE users SET 
    email = $2,
    password_hash = $3,
    profile_pic = $4,
    displayed_name = $5,
    description = $6 
WHERE username = $1 RETURNING *; `;