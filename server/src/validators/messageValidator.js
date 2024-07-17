import { param } from "express-validator";
import { groupExists } from "./commonMethods.js";

export const findGroupValidations = [
    param('id')
      .exists().withMessage('Group id is required')
      .notEmpty().withMessage('Group id cannot be empty')
      .custom(async id => {
          if (!(await groupExists(id))) {
              throw new Error('Group does not exist');
          }
      }),
  ]