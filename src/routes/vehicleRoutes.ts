import { Router } from "express";
import vehicleController from "../controller/vehicleController";

const router = Router()

router.post('/', vehicleController.createVehicle);
router.get('/:id', vehicleController.getVehicleById);
router.get('/', vehicleController.getVehicles);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
