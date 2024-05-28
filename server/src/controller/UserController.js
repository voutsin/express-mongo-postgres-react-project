import { postgresQuery } from "../db/postgres.js";
import { findAllUsersSQL } from "../db/queries/userQueries.js";

const findAll = async (req, res) => {
    try {
        const result = await postgresQuery(findAllUsersSQL);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

export default {
    findAll
};