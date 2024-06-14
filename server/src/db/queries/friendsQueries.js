import { FriendStatus } from "../../common/enums.js";

// FIND
export const findFriendshipByIds = `SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2;`;
export const findAllActiveFriendshipsByUserId = 
    `SELECT f.* FROM friends AS f 
    JOIN users AS u ON u.id = f.friend_id AND active = 1 
    WHERE f.user_id = $1 AND f.status = '${FriendStatus.ACCEPTED}';`;

// INSERT 
export const insertNewFriendshipRequest = 
    `INSERT INTO friends (user_id, friend_id, status) 
    VALUES ($1, $2, ${FriendStatus.REQUESTED}) RETURNING *; `;
export const insertNewFriendshipPending = 
    `INSERT INTO friends (user_id, friend_id, status) 
    VALUES ($2, $1, ${FriendStatus.PENDING}) RETURNING *;`;
export const insertBlockedFriendship = 
    `INSERT INTO friends (user_id, friend_id, status) 
    VALUES ($1, $2, ${FriendStatus.BLOCKED}), ($2, $1, ${FriendStatus.BLOCKED}) RETURNING *; `;

// UPDATE
export const updatePendingFriendship = 
    `UPDATE friends SET status = '${FriendStatus.ACCEPTED}' 
    WHERE (user_id = $1 OR user_id = $2) 
    AND (status = '${FriendStatus.REQUESTED}' OR status = '${FriendStatus.PENDING}') RETURNING *;`;
export const updateFriendship = 
    `UPDATE friends SET status = $3 
    WHERE (user_id = $1 AND friend_id = $2) 
    OR (user_id = $2 AND friend_id = $1) RETURNING *;`;

// DELETE
export const deleteFriendship = 
    `DELETE FROM friends 
    WHERE (user_id = $1 AND friend_id = $2) 
    OR (user_id = $2 AND friend_id = $1) RETURNING *;`;