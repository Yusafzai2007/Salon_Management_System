import { Router } from "express";
import { create_staf, delete_staff, get_staff, update_staff } from "../controllers/staff.controller.js";


const router = Router();


router.post("/create-staff",create_staf);
router.put("/update-staff/:id",update_staff);
router.get("/get-staff",get_staff);
router.delete("/delete-staff/:id",delete_staff);
export default router;


