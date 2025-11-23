import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.route.js";
import expedientesRoutes from "./expedientes.routes.js";
import evidenciasRoutes from "./evidencias.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import reportRoutes from "./report.route.js";

const router = Router();

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

router.use("/expedientes", expedientesRoutes);

router.use("/evidencias", evidenciasRoutes);

router.use("/reviews", reviewsRoutes);

router.use("/reports", reportRoutes);

export default router;
