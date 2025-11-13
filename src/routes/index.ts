import { Router } from "express";
import vehicleRoutes from "./vehicleRoutes"

const router = Router();

router.use("/vehicle", vehicleRoutes);
//router.use("/cv", cvRoutes)

export default router;