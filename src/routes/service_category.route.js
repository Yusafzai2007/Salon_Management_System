import { Router } from "express";




const router = Router();
 
import { create_category, get_all_category, delete_category, update_category } from "../controllers/service.category.controller.js";

router.post("/create_service-category", create_category);
router.get("/get_service-category", get_all_category);
router.delete("/delete_service-category/:id", delete_category);
router.put("/update_service-category/:id", update_category);





export default router;










































