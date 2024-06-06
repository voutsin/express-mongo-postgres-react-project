import { FriendStatus } from "../../common/enums.js";

// FIND
export const findAllPostsSQL = `SELECT * FROM posts;`;
export const findPostByIdSQL = `SELECT * FROM posts WHERE id = $1;`;
export const findAllPostsByUserIdSQL = `SELECT * FROM posts WHERE user_id = $1;`;
export const findAllPostsForFeedSQL = 
    `SELECT p.* FROM posts AS p 
    JOIN friends AS f ON f.user_id = $1 AND f.status = ${FriendStatus.ACCEPTED} 
    WHERE p.user_id = f.friend_id;`;

//INSERT
export const createNewPostSQL = `INSERT INTO posts (user_id, content, media_url, post_type) VALUES ($1, $2, $3, $4) RETURNING *;`

// UPDATE
export const updatePostSQL = `UPDATE posts SET content = $2, media_url = $3, post_type = $4 WHERE id = $1 RETURNING *`;

// DELETE
export const deletePostSQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;