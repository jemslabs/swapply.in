import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import { handleAddItem, handleGetBrowseItems, handleGetItem, handleGetMyItems, handleSendSwapPropsal } from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);
itemRoutes.get("/browse-items", protectRoute, handleGetBrowseItems);
itemRoutes.get("/my-items", protectRoute, handleGetMyItems)
itemRoutes.get("/get-item",handleGetItem);
itemRoutes.post("/swap-proposal", protectRoute,handleSendSwapPropsal);
export default itemRoutes