import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { postgresQuery } from '../db/postgres.js';
import { finReactionByPostIdOrCommentIdSQL } from '../db/queries/reactionsQueries.js';
import AppError from '../model/AppError.js';
import { validationResult } from 'express-validator';
import { unlink } from 'fs';

dotenv.config();

export const ACCESS_TOKEN_EXPIRE_TIME = '10s';
export const REFRESH_TOKEN_EXPIRE_TIME = '1d';
export const SECRET_KEY = process.env.TOKEN_SECRET;
export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const UPLOAD_DIR = 'uploads';
export const PROFILE_PIC_THUMBNAIL_PREFIX = 'profile_pic_thumbnail__';
export const MEDIA_THUMBNAIL_PREFIX = 'media_thumbnail__';

export const asyncHandler = fn => (req, res, next) => {
  // check validations
  const errors = validationResult(req);
  const errorMessages = !errors.isEmpty() ? errors.array() : req.errorMessages || null;
  if (errorMessages) {
      if (req.file) {
        // Optionally, delete the uploaded file if validation fails
        const mediaThumbnailUrl = getThumbnailUrl(null, req.file.path, false);
        const profileThumbnailUrl = getThumbnailUrl(null, req.file.path, true);
        unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
        unlink(mediaThumbnailUrl, (err) => {
          if (err) console.error('Failed to delete thumbnail file:', err);
        });
        unlink(profileThumbnailUrl, (err) => {
          if (err) console.error('Failed to delete thumbnail file:', err);
        });
      }
      return next(new AppError({ errors: errorMessages }, 400));
  }
  
  Promise.resolve(fn(req, res, next)).catch(next);
};


export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Parse message if it is a JSON string
  const message = JSON.parse(err.message);

  if (err.status === 500) {
    console.error({
      ...err,
      message,
    }); // Log the error details for debugging
    if (req.file) {
      // Optionally, delete the uploaded file if validation fails
      const mediaThumbnailUrl = getThumbnailUrl(null, req.file.path, false);
      const profileThumbnailUrl = getThumbnailUrl(null, req.file.path, true);
      unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
      unlink(mediaThumbnailUrl, (err) => {
        if (err) console.error('Failed to delete thumbnail file:', err);
      });
      unlink(profileThumbnailUrl, (err) => {
        if (err) console.error('Failed to delete thumbnail file:', err);
      });
    }
  }

  res.status(err.statusCode).json({
    status: err.status,
    message
  });
};

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

export const getThumbnailUrl = (id, originalUrl, forProfilePic) => {
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
  
  return forProfilePic 
    ? `${uploadPath}${PROFILE_PIC_THUMBNAIL_PREFIX}${picName}`
    : `${uploadPath}${MEDIA_THUMBNAIL_PREFIX}${picName}`;
}

export const timestampToDate = timestamp => {
  if (timestamp == null) {
    return null;
  }
  const date = new Date(timestamp);
  // Format the date
  return date.toLocaleDateString();
}

export const checkRequiredFields = (body, requiredFields) => {
  let result = true;
  Object.keys(body).forEach(key => {
    if (requiredFields.includes(key) && body[key] == null) {
      result = false;
    }
  });
  return result;
}

export const stringToBoolean = string => string.toLowerCase() === 'true';