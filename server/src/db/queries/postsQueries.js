
// FIND
export const findAllPostsSQL = `SELECT * FROM posts;`;
export const findPostByIdSQL = `SELECT * FROM posts WHERE id = $1;`;
export const findAllPostsByUserIdSQL = `SELECT * FROM posts WHERE user_id = $1;`;
export const findAllPostsForFeedSQL = ids => `SELECT * FROM posts WHERE id IN (${ids});`;
export const userCanAccessPostSQL = 
    `SELECT p.* FROM posts AS p 
    JOIN users AS u ON u.id = p.user_id AND u.active = 1 
    JOIN friends AS f ON f.friend_id = p.user_id AND f.user_id = $1 
    WHERE p.id = $2;`;

//INSERT
export const createNewPostSQL = `INSERT INTO posts (user_id, content, media_url, post_type) VALUES ($1, $2, $3, $4) RETURNING *;`

// UPDATE
export const updatePostSQL = `UPDATE posts SET content = $2, media_url = $3, post_type = $4 WHERE id = $1 RETURNING *`;

// DELETE
export const deletePostSQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;