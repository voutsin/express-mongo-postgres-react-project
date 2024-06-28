import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { postgresQuery } from '../db/postgres.js';
import { finReactionByPostIdOrCommentIdSQL } from '../db/queries/reactionsQueries.js';

dotenv.config();

export const ACCESS_TOKEN_EXPIRE_TIME = '10s';
export const REFRESH_TOKEN_EXPIRE_TIME = '1d';
export const SECRET_KEY = process.env.TOKEN_SECRET;
export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const UPLOAD_DIR = 'uploads';
export const THUMBNAIL_PREFIX = 'profile_pic_thumbnail_';

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

export const fetchReactionMiddleware = async (req, res, next) => {
  try {
    const params = [
      req.body.postId,
      req.body.commentId || -1,
      req.userId
    ]
    const reactionRes = await postgresQuery(finReactionByPostIdOrCommentIdSQL, params);
    req.postReaction = reactionRes && reactionRes.rows.filter(row => row.post_id != null && row.comment_id == null).find(() => true) || null;
    req.commentReaction = reactionRes && reactionRes.rows.filter(row => row.post_id != null && row.comment_id != null).find(() => true) || null;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching reaction' });
  }
};

export const sortResultsByCreatedDate = (results, desc = true) => {
  const sortedResults = [...results];
  sortedResults.sort(function(a,b){
    return desc 
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });
  return sortedResults;
} 

export const getThumbnailUrl = (id, originalUrl) => {
  if (originalUrl == null) {
    return null;
  }
  
  const path = originalUrl.split('/');

  // get directory
  let uploadPath = '';
  path.forEach((p, index) => {
    const lastElementIndex = path.length - 1;
    if (index !== lastElementIndex) {
      uploadPath += `${p}/`;
    }
  });

  // get suffix
  const picName = path[path.length - 1];
  const splittedName = picName.split('.');
  const suffix = splittedName[splittedName.length - 1];
  
  return `${uploadPath}${THUMBNAIL_PREFIX}${id}.${suffix}`;
}