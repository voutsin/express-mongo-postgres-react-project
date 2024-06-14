import { postgresQuery } from "../db/postgres.js";
import { searchPostSQL } from "../db/queries/postsQueries.js";
import { searchUserSQL } from "../db/queries/userQueries.js";
import { postToResDtoForSearch } from "../mapper/postMapper.js";
import { userToResDto } from "../mapper/userMapper.js";

const searchByCriteria = async (req, res) => {
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
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

export default {
    searchByCriteria
}