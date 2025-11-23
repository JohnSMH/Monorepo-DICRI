import { Router } from "express";
import * as ReportController from "../controllers/report.controller.js";

const router = Router();

router.get("/", ReportController.createReport);

export default router;
