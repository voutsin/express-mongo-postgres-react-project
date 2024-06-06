import { FriendStatus } from "../common/enums.js";
import { getActiveUser } from "../common/utils.js";
import { postgresQuery } from "../db/postgres.js";
import { findAllFriendshipsByUserId, insertNewFriendshipRequest, insertNewFriendshipPending, updatePendingFriendship, deleteFriendship, findFriendshipByIds, updateFriendship, insertBlockedFriendship } from "../db/queries/friendsQueries.js";
import { deactivateUser, findAllUsersSQL, findUserById, insertNewUser, searchUser, updateProfilePic, updateUserSQL } from "../db/queries/userQueries.js";
import { friendToResDto, newUserReqDtoToUser, updateUserReqDtoToUser, userToResDto } from "../mapper/userMapper.js";
import { validationResult } from 'express-validator';

const findAll = async (req, res) => {
    try {
      const result = await postgresQuery(findAllUsersSQL);
      res.json(result.rows.map(row => userToResDto(row)));
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Server Error: ', e);
    }
}

const registerNewUser = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const finalBody = await newUserReqDtoToUser(req.body);
    const params = Object.values(finalBody);
    const result = await postgresQuery(insertNewUser, params);
    if (result) {
      res.json(userToResDto(finalBody));
      res.status(200);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const findByUserId = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const params = Object.values(req.params).map(param => parseInt(param));
    const result = await postgresQuery(findUserById, params);
    if (result.rows.length > 0) {
      res.json(userToResDto(result.rows[0]));
      res.status(200);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const updateUser = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (req.body == null) {
      const error = {
          type: "field",
          value: null,
          msg: "User not defined",
          path: "id",
      }
      errors.push(error)
    } 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    console.error(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const findAllFriendsOfUser = async (req, res) => {
  try {
    if (req.params == null || req.params.id == null) {
      const error = {
          type: "field",
          value: null,
          msg: "User ID not defined",
          path: "id",
      }
      return res.status(400).json({ errors: [error] });
    } 
    const params = Object.values(req.params);
    const result = await postgresQuery(findAllFriendshipsByUserId, params);
    res.json(result.rows.map(result => friendToResDto(result)));
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const requestFriendship = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const params = Object.values(req.params); // param 1 is request user id
    const activeUser = getActiveUser(req);
    params.push(activeUser ? activeUser.id : null); // param 2 is active user id

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
      // send the result where user_id equals active user
      const resposne = results.filter(result => result.user_id.toString() === activeUser.id).map(result => friendToResDto(result));
      res.json(resposne);
      res.status(200);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const acceptFriendship = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      // send the result where user_id equals active user
      const resposne = results.filter(result => result.user_id.toString() === activeUser.id).map(result => friendToResDto(result));
      res.json(resposne);
      res.status(200);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const deleteFriend = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const params = Object.values(req.params); // param 1 is request user id
    const activeUser = getActiveUser(req);
    params.push(activeUser ? activeUser.id : null); // param 2 is active user id

    const result = await postgresQuery(deleteFriendship, params);
    // return result
    if (result) {
      res.json(result.rows.map(result => friendToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const blockUser = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      res.json(result.rows.map(result => friendToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const deactivateProfile = async (req, res) => {
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
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const searchUserByCriteria = async (req, res) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const params = Object.values(req.params);
    const results = await postgresQuery(`SELECT * FROM users WHERE (username ILIKE '%${params[0]}%' OR email ILIKE '%${params[0]}%' OR displayed_name ILIKE '%${params[0]}%') AND active = 1;`)
    if (results) {
      res.json(results.rows.map(result => userToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

const editProfilePic = async (req, res) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profilePicPath = req.file ? req.file.path : null;
    if (!profilePicPath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      throw new Error('No active user found');
    }

    const params = [activeUser.id, profilePicPath]
    const results = await postgresQuery(updateProfilePic, params)
    
    // TODO: add post here

    if (results) {
      res.json(results.rows.map(result => userToResDto(result)));
      res.status(200);
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('Internal Server Error: ', e);
  }
}

export default {
    findAll,
    registerNewUser,
    findByUserId,
    updateUser,
    findAllFriendsOfUser,
    requestFriendship,
    acceptFriendship,
    deleteFriend,
    blockUser,
    deactivateProfile,
    searchUserByCriteria,
    editProfilePic,
};