// FIND
export const findAllReactionsSQL = `SELECT * FROM reactions;`;
export const findReactionByIdSQL = `SELECT * FROM reactions WHERE id = $1;`;
export const finReactionByPostIdOrCommentIdSQL = `SELECT * FROM reactions WHERE user_id = $3 AND ((post_id = $1 AND comment_id IS NULL) OR (post_id = $1 AND comment_id = $2));`;
export const findReactionByCommentIdSQL = `SELECT * FROM reactions WHERE comment_id = $1;`;
export const findReactionByPostIdsOnlySQL = `SELECT * FROM reactions WHERE post_id IN ($1) AND comment_id IS NULL;`;
export const findReactionByCommentIdsSQL = `SELECT * FROM reactions WHERE comment_id IN ($1);`;
export const findReactionsInIds = reactionIds => `SELECT * FROM reactions WHERE id IN (${reactionIds});`;

// INSERT
export const insertNewReactionSQL = 
    `INSERT INTO reactions 
    (user_id, post_id, comment_id, reaction_type) 
    VALUES 
    ($1, $2, $3, $4) RETURNING*;`;

// UPDATE
export const updateReactionSQL = `UPDATE reactions SET reaction_type = $2 WHERE id = $1 RETURNING*;`;

// DELETE
export const deleteReactoinByIdSQL = `DELETE FROM reactions WHERE id = $1 RETURNING *;`;
export const deleteReactionsByCommentIdSQL = `DELETE FROM reactions WHERE comment_id = $1;`;
export const deleteReactionsByPostIdSQL = `DELETE FROM reactions WHERE post_id = $1;`;