import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import {
  handleAddItem,
  handleGetItem,
} from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);
itemRoutes.get("/get-item", handleGetItem);

export default itemRoutes;
