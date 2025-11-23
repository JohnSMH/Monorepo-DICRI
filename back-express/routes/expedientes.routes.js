import { Router } from "express";
import * as Expedientes from "../controllers/expedientes.controller.js";

const router = Router();

router.get("/", Expedientes.list);
router.get("/:id", Expedientes.getById);
router.post("/", Expedientes.create);
router.put("/:id", Expedientes.update);
router.delete("/:id", Expedientes.remove);

export default router;
