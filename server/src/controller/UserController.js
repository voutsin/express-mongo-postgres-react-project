import { FriendStatus, PostType } from "../common/enums.js";
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRE_TIME, MEDIA_THUMBNAIL_PREFIX, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_EXPIRE_TIME, SECRET_KEY, UPLOAD_DIR, asyncHandler, getActiveUser } from "../common/utils.js";
import { postgresQuery } from "../db/postgres.js";
import { findAllActiveFriendshipsByUserId, insertNewFriendshipRequest, insertNewFriendshipPending, updatePendingFriendship, deleteFriendship, findFriendshipByIds, updateFriendship, insertBlockedFriendship, findUserFrinedsBirthdays, findAllDetailedActiveFriendshipsByUserId } from "../db/queries/friendsQueries.js";
import { deactivateUser, findAllUsersSQL, findUserById, insertNewUser, updateProfilePic, updateUserSQL } from "../db/queries/userQueries.js";
import { detailedFriendToResDto, detailedFriendToResDtoWithCounters, friendAndUserResDto, friendToResDto, newUserReqDtoToUser, updateUserReqDtoToUser, userDetailedResDto, userToResDto } from "../mapper/userMapper.js";
import { validationResult } from 'express-validator';
import { readdir, unlink } from 'fs';
import jwt from 'jsonwebtoken';
import { createNewPostSQL } from '../db/queries/postsQueries.js';
import { postReqDtoToPost, postToResDto } from '../mapper/postMapper.js';
import { insertNewFeedForPost } from '../db/repositories/FeedRepository.js';
import AppError from "../model/AppError.js";
import { join } from "path";
import { acceptFriendshipNotification, deleteFriendshipNotification, insertFriendshipNotification } from "../db/repositories/NotificationRepository.js";
import { emitNotification } from "../socket/utils.js";

const findAll = asyncHandler(async (req, res, next) => {
    try {
      const result = await postgresQuery(findAllUsersSQL);
      res.json(result.rows.map(row => userToResDto(row)));
    } catch (e) {
      next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const registerNewUser = asyncHandler(async (req, res, next) => {
  try {
      const finalBody = await newUserReqDtoToUser(req.body);
      const params = Object.values(finalBody);
      const result = await postgresQuery(insertNewUser, params);
      if (result) {
        const user = result.rows[0];
        const authUser = {
          userId: user.id,
          username: user.username,
        }

        const accessToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
        const refreshToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRE_TIME });

        res.cookie(ACCESS_TOKEN_COOKIE, accessToken);
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        res.json(userToResDto(user));
        res.status(200);
    }
  } catch (e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const findByUserId = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params).map(param => parseInt(param));
    const result = await postgresQuery(findUserById, params);
    if (result.rows.length > 0) {
      res.json(userDetailedResDto(result.rows[0]));
      res.status(200);
    }
  } catch (e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  try {
    // mapper
    const finalBody = await updateUserReqDtoToUser(req.body);
    // update query
    const params = Object.values(finalBody);
    const result = await postgresQuery(updateUserSQL, params);
    // return result
    if (result) {
      res.json(userToResDto(result.rows[0]));
      res.status(200);
    }
  } catch (e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const findAllFriendsOfUser = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params);
    const result = await postgresQuery(findAllActiveFriendshipsByUserId, params);
    const resposne = await detailedFriendToResDto(result.rows, false);
    res.json(resposne);
  } catch (e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const findAllDetailedFriendsOfUser = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params);
    const result = await postgresQuery(findAllDetailedActiveFriendshipsByUserId, [...params, req.userId]);
    const friendships = req.userId === req.params.id 
      ? result.rows
      : result.rows.filter(f => f.status === FriendStatus.ACCEPTED);
    const resposne = await detailedFriendToResDto(friendships, true);
    res.json(detailedFriendToResDtoWithCounters(resposne));
  } catch (e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const requestFriendship = asyncHandler(async (req, res, next) => {
  try {
    let params = Object.values(req.body); 
    const activeUser = getActiveUser(req);
    params = [
      activeUser.id, // param 1 is active user id
      ...params // param 2 is request user id
    ]
    const results = [];
    const res1 = await postgresQuery(insertNewFriendshipRequest, params);
    if (res1) {
      results.push(res1.rows[0]);
    }
    const res2 = await postgresQuery(insertNewFriendshipPending, params);
    if (res2) {
      results.push(res2.rows[0]);
    }

    if (results) {
      // insert notification
      const notification = await insertFriendshipNotification(params[0], params[1]);
      await emitFriendshipNotification(notification, results, activeUser.id, next);

      // send the result where user_id equals active user
      const resposne = results.filter(result => result.user_id.toString() === activeUser.id).map(result => friendToResDto(result));
      res.json(resposne);
      res.status(200);
    }
  } catch (e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const acceptFriendship = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params); // param 1 is request user id
    const activeUser = getActiveUser(req);
    params.push(activeUser ? activeUser.id : null); // param 2 is active user id

    let results = [];
    const intParams = params.map(p => parseFloat(p));
    const res1 = await postgresQuery(updatePendingFriendship, intParams);
    if (res1) {
      results = res1.rows;
    }

    if (results) {
      // insert notification
      const notification = await acceptFriendshipNotification(activeUser.id, params[0]);
      await emitFriendshipNotification(notification, results, activeUser.id, next);

      // send the result where user_id equals active user
      const resposne = results.filter(result => result.user_id.toString() === activeUser.id).map(result => friendToResDto(result));
      res.json(resposne);
      res.status(200);
    }
  } catch(e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const deleteFriend = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params); // param 1 is request user id
    const activeUser = getActiveUser(req);
    params.push(activeUser ? activeUser.id : null); // param 2 is active user id

    const result = await postgresQuery(deleteFriendship, params);
    // return result
    if (result) {
      // delete notification
      const deleteNotificationResult = await deleteFriendshipNotification(activeUser.id, params[0]);
      await emitDeleteFriendshipNotification(deleteNotificationResult.foundIds, result.rows, activeUser.id, next);

      res.json(result.rows.map(result => friendToResDto(result)));
      res.status(200);
    }
  } catch(e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const blockUser = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params); // param 1 is request user id
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      throw new Error('No active user found');
    }
    const friendsResult = await postgresQuery(findFriendshipByIds, [activeUser.id, ...params])
    const alreadyFriends = friendsResult ? friendsResult.rows[0] : null;
    
    params.push(activeUser ? activeUser.id : null); // param 2 is active user id
    let result = null;

    if (alreadyFriends) {
      params.push(FriendStatus.BLOCKED);
      result = await postgresQuery(updateFriendship, params);
    } else {
      result = await postgresQuery(insertBlockedFriendship, params);
    }
    
    // return result
    if (result) {
      // delete notification
      await deleteFriendshipNotification(activeUser.id, req.params.id);

      res.json(result.rows.map(result => friendToResDto(result)));
      res.status(200);
    }
  } catch(e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const deactivateProfile = asyncHandler(async (req, res, next) => {
  try {
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      throw new Error('No active user found');
    }

    // deactive user
    const result = await postgresQuery(deactivateUser, [activeUser.id]);
    if (result) {
      res.json(result.rows.map(result => userToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

// TODO: check if needed as endpoint
const searchUserByCriteria = asyncHandler(async (req, res, next) => {
  try {
    const params = Object.values(req.params);
    const results = await postgresQuery(`SELECT * FROM users WHERE (username ILIKE '%${params[0]}%' OR email ILIKE '%${params[0]}%' OR displayed_name ILIKE '%${params[0]}%') AND active = 1;`)
    if (results) {
      res.json(results.rows.map(result => userToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const editProfilePic = asyncHandler(async (req, res, next) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, respond with errors and delete the uploaded file
      if (req.file) {
        // Optionally, delete the uploaded file if validation fails
        unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const profilePicPath = req.file ? req.file.path : null;
    if (!profilePicPath) {
      next(new AppError('No file uploaded', 400));
    }

    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      throw new Error('No active user found');
    }

    const params = [activeUser.id, profilePicPath]
    const results = await postgresQuery(updateProfilePic, params)
    
    // add user post about new profile pic
    const finalBody = {
        userId: parseInt(activeUser.id),
        content: `New Profile picture for user ${activeUser.username}`,
        postType: PostType.PROFILE_PIC,
        mediaUrl: profilePicPath,
    }

    const postParams = Object.values(postReqDtoToPost(finalBody));
    const postResult = await postgresQuery(createNewPostSQL, postParams);

    // add post to feed
    const newFeed = await insertNewFeedForPost(postResult.rows[0], parseInt(activeUser.id));

    if (results) {
      res.json(results.rows.map(result => ({
        user: userToResDto(result),
        post: postToResDto(postResult.rows[0]),
        feed: newFeed,
      })));
      res.status(200);
    }
  } catch(e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const findFriendsBirthdays = asyncHandler(async (req, res, next) => {
  try {
    const results = await postgresQuery(findUserFrinedsBirthdays, [req.userId]);
    if (results) {
      res.json(results.rows.map(row => friendAndUserResDto(row)));
      res.status(200);
    }
  } catch(e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const findUserPhotos = asyncHandler(async (req, res, next) => {
  try {
    const mediaDir = join(UPLOAD_DIR, req.params.id);

    readdir(mediaDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to read media directory' });
      }

      // Map the filenames to their respective paths
      res.json(files.filter(file => file.includes(MEDIA_THUMBNAIL_PREFIX))
        .map(file => ({
          thumbnailUrl: join('/', UPLOAD_DIR, req.params.id, file),
          name: file.split('.')[0],
          url: join('/', UPLOAD_DIR, req.params.id, file.split(MEDIA_THUMBNAIL_PREFIX)[1]),
        })));
    });
  } catch(e) {
    next(new AppError('Internal Server Error: ' + e, 500));
  }
});

const emitFriendshipNotification = async (notification, friendships, activeUserId, next) => {
  try {
      const targetedUser = friendships && friendships.find(f => f.user_id !== parseInt(activeUserId));
      if (targetedUser) {
          emitNotification(targetedUser.user_id, notification, 'send_notification');
      }
  } catch(e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
}

const emitDeleteFriendshipNotification = async (idsToBeDeleted, friendships, activeUserId, next) => {
  try {
      const targetedUser = friendships && friendships.find(f => f.user_id !== parseInt(activeUserId));
      if (targetedUser) {
          emitNotification(targetedUser.user_id, {idsToBeDeleted}, 'delete_notifications');
      }
  } catch(e) {
      next(new AppError('Internal Server Error: ' + e, 500));
  }
}

export default {
    findAll,
    registerNewUser,
    findByUserId,
    updateUser,
    findAllFriendsOfUser,
    findAllDetailedFriendsOfUser,
    requestFriendship,
    acceptFriendship,
    deleteFriend,
    blockUser,
    deactivateProfile,
    searchUserByCriteria,
    editProfilePic,
    findFriendsBirthdays,
    findUserPhotos,
};