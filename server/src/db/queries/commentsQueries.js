
// FIND
export const findAllCommentsByUserId = `SELECT * FROM comments WHERE user_id = $1;`;
export const findCommentByIdSQL = `SELECT * FROM comments WHERE id = $1;`;
export const findCommentByIdAndActiveUserSQL = `SELECT c.* FROM comments AS c JOIN users AS u ON u.id = c.user_id AND u.active = 1 WHERE c.id = $1;`;
export const findCommentsInIds = commentIds => `SELECT * FROM comments WHERE id IN (${commentIds});`;
export const findCommentsByPostId = `SELECT * FROM comments WHERE post_id = $1;`;
export const selectCountOfCommentsSQL = 'SELECT COUNT(*) FROM comments WHERE post_id = $1 AND reply_comment_id IS NULL;';
export const selectCountOfRepliesSQL = 'SELECT COUNT(*) FROM comments WHERE reply_comment_id = $1;';
export const selectCountOfPostCommentsSQL = 'SELECT COUNT(*) FROM comments WHERE post_id = $1;';
export const findCommentAndUserByIdSQL = 
  `SELECT json_build_object(
        'id', c.id,
        'user', json_build_object(
            'id', u.id,
            'displayed_name', u.displayed_name,
            'username', u.username,
            'email', u.email,
            'created_at', u.created_at, 
            'profile_pic', u.profile_pic,
            'description', u.description, 
            'active', u.active
        ),
        'post_id', c.post_id, 
        'content', c.content, 
        'created_at', c.created_at, 
        'is_reply', c.is_reply, 
        'reply_comment_id', c.reply_comment_id 
    ) AS result
  FROM comments AS c
  JOIN users AS u ON u.id = c.user_id
  WHERE c.id = $1;`;
export const findSingleCommentsByPostId = 
  `SELECT json_build_object(
        'id', c.id,
        'user', json_build_object(
            'id', u.id,
            'displayed_name', u.displayed_name,
            'username', u.username,
            'email', u.email,
            'created_at', u.created_at, 
            'profile_pic', u.profile_pic,
            'description', u.description, 
            'active', u.active
        ),
        'post_id', c.post_id, 
        'user_id', c.user_id, 
        'content', c.content, 
        'created_at', c.created_at, 
        'is_reply', c.is_reply, 
        'reply_comment_id', c.reply_comment_id,
        'latestReply', (
            SELECT json_build_object(
                'id', r.id,
                'user_id', r.user_id,
                'user', json_build_object(
                    'id', u.id,
                    'displayed_name', u.displayed_name,
                    'username', u.username,
                    'email', u.email,
                    'created_at', u.created_at, 
                    'profile_pic', u.profile_pic,
                    'description', u.description, 
                    'active', u.active
                ),
                'post_id', r.post_id,
                'content', r.content,
                'created_at', r.created_at,
                'is_reply', r.is_reply,
                'reply_comment_id', r.reply_comment_id
            )
            FROM comments AS r 
            JOIN users AS u ON u.id = r.user_id
            WHERE r.reply_comment_id = c.id
            ORDER BY r.created_at DESC
            LIMIT 1
        )  
    ) AS result 
  FROM comments AS c 
  JOIN users AS u ON u.id = c.user_id
  WHERE c.post_id = $1 AND c.reply_comment_id IS NULL
  ORDER BY c.created_at DESC
  LIMIT $2 OFFSET $3;`;
export const findCommentRepliesSQL = `SELECT json_build_object(
        'id', c.id,
        'user', json_build_object(
            'id', u.id,
            'displayed_name', u.displayed_name,
            'username', u.username,
            'email', u.email,
            'created_at', u.created_at, 
            'profile_pic', u.profile_pic,
            'description', u.description, 
            'active', u.active
        ),
        'post_id', c.post_id, 
        'user_id', c.user_id, 
        'content', c.content, 
        'created_at', c.created_at, 
        'is_reply', c.is_reply, 
        'reply_comment_id', c.reply_comment_id
    ) AS result 
  FROM comments AS c 
  JOIN users AS u ON u.id = c.user_id
  WHERE c.reply_comment_id = $1 
  ORDER BY c.created_at DESC
  LIMIT $2 OFFSET $3;`;

// INSERT 
export const addNewCommentSQL = `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *;`;
export const insertNewReplySQL = `INSERT INTO comments (post_id, user_id, content, is_reply, reply_comment_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

// UPDATE
export const updateCommentSQL = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *;`;

// DELETE
export const deleteCommentSQL = 
    `WITH Deleted AS ( 
      DELETE FROM comments 
      WHERE id = $1 OR reply_comment_id = $1 
      RETURNING id, user_id, post_id 
    ) 
    SELECT * FROM comments 
    WHERE user_id IN (SELECT user_id FROM Deleted) 
      AND post_id IN (SELECT post_id FROM Deleted) 
      AND id <> (SELECT id FROM Deleted) 
    ORDER BY created_at DESC 
    LIMIT 1;`;
export const deleteCommentsByPostId = `DELETE FROM comments WHERE post_id = $1;`;