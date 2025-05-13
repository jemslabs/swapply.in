import { Hono } from "hono";
import { handleAuth } from "../controllers/auth";

const authRoutes = new Hono();

authRoutes.post("/login", handleAuth);

export default authRoutes;
