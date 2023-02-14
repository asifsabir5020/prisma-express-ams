import express from "express";
import { create, findAll, findOne, remove, update } from "../controllers/programController";
import { authorize } from "../middlewares/auth";

export const programRouter = express.Router();

programRouter
  .route("/")
  .get(findAll)
  .post(authorize('ADMIN', 'PRINCIPAL'), create);

programRouter
  .route("/:id")
  .get(findOne)
  .put(authorize('ADMIN', 'PRINCIPAL'), update)
  .delete(authorize('ADMIN', 'PRINCIPAL'), remove);

