import { FriendStatus } from "../../common/enums.js";

// FIND
export const findFriendshipByIds = `SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2;`;
export const findAllActiveFriendshipsByUserId = 
    `SELECT f.* FROM friends AS f 
    JOIN users AS u ON u.id = f.friend_id AND active = 1 
    WHERE f.user_id = $1 AND f.status = '${FriendStatus.ACCEPTED}';`;
export const findAllDetailedActiveFriendshipsByUserId = 
    `SELECT 
        f.*,
        CASE 
            WHEN u.id != $2 THEN (
                SELECT fr.status  
                FROM friends fr 
                WHERE ((fr.user_id = $2 AND fr.friend_id = u.id) 
                   OR (fr.user_id = u.id AND fr.friend_id = $2)) LIMIT 1
            )
            ELSE '${FriendStatus.ACCEPTED}'
        END AS is_friends 
    FROM friends AS f 
    JOIN users AS u ON u.id = f.friend_id AND active = 1 
    WHERE f.user_id = $1;`;
export const findUserFrinedsBirthdays = 
    `SELECT f.*, f.created_at as fr_created_at, u.* 
    FROM friends AS f 
    JOIN users AS u ON u.id = f.friend_id AND TO_CHAR(u.birth_date, 'MM-DD') = TO_CHAR(CURRENT_DATE, 'MM-DD') AND u.active = 1 
    WHERE f.user_id = $1; `;
export const findAllFriendshipsByUserIdAndStatus = 
    `SELECT f.* FROM friends AS f 
    WHERE f.user_id = $1 AND f.friend_id = $2 AND f.status = $3;`;

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
    WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) 
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