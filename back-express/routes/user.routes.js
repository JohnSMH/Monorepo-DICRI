import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";

const router = Router();

// CRUD
router.get("/", UserController.list);
router.get("/:id", UserController.getById);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

export default router;
