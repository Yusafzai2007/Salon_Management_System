import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import user_route from "./routes/user.route.js";
import service_route from "./routes/service.route.js";
import service_category_route from "./routes/service_category.route.js";
import staff_route from "./routes/staff.route.js";
import { apiError } from "./utils/apiError.js";

app.use("/api/v1/salon", user_route);
app.use("/api/v1/salon", service_route);
app.use("/api/v1/salon", service_category_route);
app.use("/api/v1/salon", staff_route);






// ================= Error Handling =================
app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      error: err.error || [],
    });
  }
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});



export default app;
