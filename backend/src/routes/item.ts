import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import { handleAddItem } from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);

export default itemRoutes