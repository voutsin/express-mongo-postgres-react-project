import { FriendStatus } from "../../common/enums.js";

// FIND
export const findAllReactionsSQL = `SELECT * FROM reactions;`;
export const findReactionByIdSQL = `SELECT * FROM reactions WHERE id = $1;`;
export const findReactionByIdAndActiveUserSQL = `SELECT r.* FROM reactions AS r JOIN users AS u ON u.id = r.user_id AND u.active = 1 WHERE r.id = $1;`;
export const finReactionByPostIdOrCommentIdSQL = `SELECT * FROM reactions WHERE user_id = $3 AND ((post_id = $1 AND comment_id IS NULL) OR (post_id = $1 AND comment_id = $2));`;
export const findReactionByCommentIdSQL = `SELECT * FROM reactions WHERE comment_id = $1;`;
export const findReactionByPostIdsOnlySQL = `SELECT * FROM reactions WHERE post_id IN ($1) AND comment_id IS NULL;`;
export const findReactionByCommentIdsSQL = `SELECT * FROM reactions WHERE comment_id IN ($1);`;
export const findReactionsInIds = reactionIds => `SELECT * FROM reactions WHERE id IN (${reactionIds});`;

export const findReactionByPostIdOnlySQL = 
    `SELECT json_build_object(
        'id', r.id,
        'user', json_build_object(
            'id', u.id,
            'displayed_name', u.displayed_name,
            'username', u.username,
            'email', u.email,
            'created_at', u.created_at, 
            'profile_pic', u.profile_pic,
            'description', u.description, 
            'active', u.active, 
            'is_friends', EXISTS (
                SELECT 1 
                FROM friends f 
                WHERE ((f.user_id = $2 AND f.friend_id = u.id) 
                   OR (f.user_id = u.id AND f.friend_id = $2)) AND f.status = '${FriendStatus.ACCEPTED}'
            )
        ),
        'post_id', r.post_id, 
        'comment_id', r.comment_id, 
        'reaction_type', r.reaction_type, 
        'created_at', r.created_at 
    ) AS result
    FROM reactions AS r 
    JOIN users AS u ON u.id = r.user_id 
    WHERE r.post_id = $1 AND r.comment_id IS NULL;`;

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