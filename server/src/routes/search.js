import express from "express";
import SearchController from "../controller/SearchController.js";

const searchRouter = express.Router();

// find all users
searchRouter.get('/criteria', SearchController.searchByCriteria);

export default searchRouter;