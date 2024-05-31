import { postgresQuery } from "../db/postgres.js";
import { findAllUsersSQL, insertNewUser } from "../db/queries/userQueries.js";
import { reqDtoToUser, userToResDto } from "../mapper/userMapper.js";
import { validationResult } from 'express-validator';

const findAll = async (req, res) => {
    try {
        const result = await postgresQuery(findAllUsersSQL);
        res.json(result.rows.map(row => userToResDto(row)));
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

const registerNewUser = async (req, res) => {
  try {
    // check validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const finalBody = await reqDtoToUser(req.body);
    const params = Object.values(finalBody);
    const result = await postgresQuery(insertNewUser, params);
    if (result) {
      res.json(userToResDto(finalBody));
      res.status(200);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

export default {
    findAll,
    registerNewUser
};