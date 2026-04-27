import { Router } from "express";
import { createaccount, delete_user, edit_user, get_current_user, get_singleuser, get_user, logout_user, user_login } from "../controllers/user.controller.js";
import { loginlimt } from "../middlewares/rateLimiter.js";
import { jwtverify } from "../middlewares/auth.middleware.js";

const route=Router()


route.post("/signup",createaccount)
route.post("/login",user_login)
route.get("/get_user",get_user)
route.put("/edit_user/:id",edit_user)
route.post("/logout_user",jwtverify,logout_user)
route.get("/current-user",jwtverify,get_current_user)
route.delete("/delete_user/:id",delete_user)
route.get("/single-user/:id",get_singleuser)
export default route