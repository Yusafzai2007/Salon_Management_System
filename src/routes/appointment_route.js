import { Router } from "express";
import {
  create_appointment,
  delete_appointment,
  update_appointment,
} from "../controllers/appointment.controller.js";
import { jwtverify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create_appointment", jwtverify, create_appointment);
router.put("/update_appointment/:id", jwtverify, update_appointment);
router.delete("/delete_appointment/:id", jwtverify, delete_appointment);
router.get("/get_appointment/:id", get_appointment);
export default router;
