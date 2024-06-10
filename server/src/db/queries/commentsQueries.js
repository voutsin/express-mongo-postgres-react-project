
// FIND
export const findAllCommentsByUserId = `SELECT * FROM comments WHERE user_id = $1;`;
export const findCommentByIdSQL = `SELECT * FROM comments WHERE id = $1;`;
export const findCommentsInIds = `SELECT * FROM comments WHERE id IN ($1);`;
export const findCommentsByPostId = `SELECT * FROM comments WHERE post_id = $1;`;

// INSERT 
export const addNewCommentSQL = `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *;`;

// UPDATE
export const updateCommentSQL = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *;`;

// DELETE
export const deleteCommentSQL = 
    `WITH Deleted AS ( 
      DELETE FROM comments 
      WHERE id = $1 
      RETURNING id, user_id, post_id 
    ) 
    SELECT * FROM comments 
    WHERE user_id = (SELECT user_id FROM Deleted) 
      AND post_id = (SELECT post_id FROM Deleted) 
      AND id <> (SELECT id FROM Deleted) 
    ORDER BY created_at DESC 
    LIMIT 1;`;