
// FIND
export const findAllPostsSQL = `SELECT * FROM posts;`;
export const findPostByIdSQL = `SELECT * FROM posts WHERE id = $1;`;
export const findPostByIdAndActiveUserSQL = `SELECT p.* FROM posts AS p JOIN users AS u ON u.id = p.user_id AND u.active = 1 WHERE p.id = $1;`;
export const findAllPostsByUserIdSQL = `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`;
export const findPostsCountByUserIdSQL = `SELECT COUNT(*) FROM posts WHERE user_id = $1;`;
export const findAllPostsForFeedSQL = ids => `SELECT * FROM posts WHERE id IN (${ids});`;
export const userCanAccessPostSQL = 
    `SELECT p.* FROM posts AS p 
    JOIN users AS u ON u.id = p.user_id AND u.active = 1 
    JOIN friends AS f ON f.friend_id = p.user_id AND f.user_id = $1 
    WHERE p.id = $2;`;
export const searchPostSQL = text => 
    `SELECT * FROM posts 
    WHERE content ILIKE '%${text}%';`;
export const findPostDetailsSQL = 
    `SELECT 
        p.id AS postId,
        p.user_id AS postUserId,
        p.content AS postContent,
        p.media_url AS postMediaUrl,
        p.created_at AS postCreatedAt,
        p.post_type AS postType, 
        u.id AS userId,
        u.username AS userName,
        u.email AS userEmail,
        u.created_at AS userCreatedAt,
        u.profile_pic AS userProfPicUrl,
        u.displayed_name AS userDisplayName,
        u.description AS userDesc,
        u.birth_date AS userBirthDate,
        u.active AS userActive, 
        (SELECT count(c.*) FROM comments AS c WHERE c.post_id = p.id) AS commentCount,
        (SELECT count(r.*) FROM reactions AS r WHERE r.post_id = p.id AND r.comment_id IS NULL) AS reactionCount
    FROM posts AS p 
    JOIN users AS u ON u.id = p.user_id 
    WHERE p.id = $1;`;

//INSERT
export const createNewPostSQL = `INSERT INTO posts (user_id, content, media_url, post_type) VALUES ($1, $2, $3, $4) RETURNING *;`

// UPDATE
export const updatePostSQL = `UPDATE posts SET content = $2, media_url = $3, post_type = $4 WHERE id = $1 RETURNING *`;

// DELETE
export const deletePostSQL = `DELETE FROM posts WHERE id = $1 RETURNING *;`;