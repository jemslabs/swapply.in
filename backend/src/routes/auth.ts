import { Hono } from "hono";
import {
  handleAuth,
  handleGetPublicUser,
  handleGetSwapRequests,
  handleGetUser,
} from "../controllers/auth";
import { protectRoute } from "../middlewares/protectRoute";

const authRoutes = new Hono();

authRoutes.post("/login", handleAuth);
authRoutes.get("/user", protectRoute, handleGetUser);
authRoutes.get("/get-user", handleGetPublicUser);
authRoutes.get("/swap-requests", protectRoute, handleGetSwapRequests);

export default authRoutes;
