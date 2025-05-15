import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import { handleAddItem, handleGetBrowseItems } from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);
itemRoutes.get("/browse-items", protectRoute, handleGetBrowseItems);
export default itemRoutes