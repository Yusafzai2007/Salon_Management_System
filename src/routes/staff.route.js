import { Router } from "express";
import { create_staf } from "../controllers/staff.controller.js";



const router = Router();


router.post("/create-staff",create_staf);

export default router;













































