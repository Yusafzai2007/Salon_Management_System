import { Router } from "express";
import {
  create_service,
  delete_service,
  get_services,
  single_service,
  update_service,
} from "../controllers/service.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post(
  "/create-service",
  upload.fields([
    {
      name: "service_Image",
      maxCount: 3,
    },
  ]),
  create_service,
);
router.put(
  "/update_service/:id",
  upload.fields([
    {
      name: "service_Image",
      maxCount: 3,
    },
  ]),
  update_service,
);
router.get("/services", get_services);
router.delete("/delete_service/:id", delete_service);
router.get("/single_service/:id", single_service);
export default router;
