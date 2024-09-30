import { asyncHandler } from "../common/utils.js";
import { postgresQuery } from "../db/postgres.js";
import { searchPostSQL } from "../db/queries/postsQueries.js";
import { searchUserSQL } from "../db/queries/userQueries.js";
import { postToResDtoForSearch } from "../mapper/postMapper.js";
import { userToResDto } from "../mapper/userMapper.js";
import AppError from "../model/AppError.js";

const searchByCriteria = asyncHandler(async (req, res, next) => {
    try {
        const text = req.query.text;
        // search content in users
        const userResults = await postgresQuery(searchUserSQL(text));
        const users = userResults ? userResults.rows.map(user => userToResDto(user)) : [];

        // search content in posts
        const postResults = await postgresQuery(searchPostSQL(text));
        const posts = await Promise.all(postResults.rows.map(async user => await postToResDtoForSearch(user)));
        
        res.json({
          users, 
          userCount: users.length,
          posts,
          postCount: posts.length,
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

export default {
    searchByCriteria
}