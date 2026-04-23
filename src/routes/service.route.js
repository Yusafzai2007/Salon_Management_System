import { Router } from "express";
import { create_service, get_services, update_service } from "../controllers/service.controller.js";
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

export default router;
