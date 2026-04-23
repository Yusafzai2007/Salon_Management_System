import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiError } from "./utils/apiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes
import user_route from "./routes/user.route.js";
import service_route from "./routes/service.route.js";
import staff_route from "./routes/staff.route.js";

app.use("/api/v1/salon/users", user_route);
app.use("/api/v1/salon/services", service_route);
app.use("/api/v1/salon/staff", staff_route);

// ✅ 404 handler
app.use((req, res, next) => {
  next(new apiError(404, "Route not found"));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statusCode || 400).json({
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