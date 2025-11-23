import { Router } from "express";
import * as Evidencias from "../controllers/evidencias.controller.js";

const router = Router();

router.get("/expediente/:expedienteId", Evidencias.listByExpediente);
router.get("/:id", Evidencias.getById);
router.post("/", Evidencias.create);
router.put("/:id", Evidencias.update);
router.delete("/:id", Evidencias.remove);

export default router;
