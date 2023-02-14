import express from "express";
import {
  create,
  findAll,
  update,
  findOne,
  remove,
} from "../controllers/bookController";
import { authenticate } from "../middlewares/auth";
const bookRouter = express.Router();

bookRouter
  .route("/")
  .get(authenticate, findAll)
  .post(create);

bookRouter
  .route("/:id")
  .get(findOne)
  .put(update)
  .delete(remove);

export { bookRouter };
