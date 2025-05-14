import { Hono } from "hono";
import { handleAuth, handleGetUser, handleUserLogout } from "../controllers/auth";
import { protectRoute } from "../middlewares/protectRoute";

const authRoutes = new Hono();

authRoutes.post("/login", handleAuth);
authRoutes.get("/user", protectRoute,handleGetUser);
authRoutes.post("/logout", protectRoute, handleUserLogout);



export default authRoutes;