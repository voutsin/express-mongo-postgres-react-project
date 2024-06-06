import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { postgresQuery } from '../db/postgres.js';

dotenv.config();

export const ACCESS_TOKEN_EXPIRE_TIME = '10s';
export const REFRESH_TOKEN_EXPIRE_TIME = '1d';
export const SECRET_KEY = process.env.TOKEN_SECRET;
export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const getActiveUser = req => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
  let activeUser = null;

  try {
    activeUser = jwt.verify(accessToken, SECRET_KEY);
  } catch(err) {
    try {
      activeUser = jwt.verify(refreshToken, SECRET_KEY);
    } catch (e) {
      activeUser = null
    }
  }

  return {
    ...activeUser,
    id: activeUser.userId.toString(),
  };
}

export const insertMultipleStatements = async statements => {
  const results = [];
  try {
    await statements.forEach( async statement => {
      const res = await postgresQuery(statement.SQL, statement.params);
      if (res) {
        results.push(res.rows[0]);
      }
    })
  } catch (e) {
    throw new Error('Error while inserting: ', e);
  }
}

export const addActiveUserIdInReq = (req, res, next) => {
  try {
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      throw new Error('No active user found');
    }

    req.userId = activeUser.id;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).send('Something went wrong retrieving user id.');
  }
}

export const sortResultsByCreatedDate = (results, desc = true) => {
  const sortedResults = [...results];
  sortedResults.sort(function(a,b){
    return desc 
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });
  return sortedResults;
} 