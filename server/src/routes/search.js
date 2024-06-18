import express from "express";
import SearchController from "../controller/SearchController.js";

const searchRouter = express.Router();

// search by criteria (text)
searchRouter.get('/criteria', SearchController.searchByCriteria);

export default searchRouter;