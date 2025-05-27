import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import { handleAcceptSwapProposal, handleAddItem, handleCancelSwapProposal, handleGetBrowseItems, handleGetItem, handleGetMyItems, handleGetSwap, handleRejectSwapProposal, handleScheduleMeeting, handleSendSwapPropsal } from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);
itemRoutes.get("/browse-items", protectRoute, handleGetBrowseItems);
itemRoutes.get("/my-items", protectRoute, handleGetMyItems)
itemRoutes.get("/get-item",handleGetItem);
itemRoutes.post("/swap-proposal", protectRoute,handleSendSwapPropsal);
itemRoutes.put("/accept-swap-proposal", protectRoute, handleAcceptSwapProposal);
itemRoutes.put("/reject-swap-proposal", protectRoute, handleRejectSwapProposal);
itemRoutes.put("/cancel-swap-proposal", protectRoute, handleCancelSwapProposal);
itemRoutes.get("/get-swap", protectRoute, handleGetSwap);
itemRoutes.post("/schedule-swap-meeting", protectRoute, handleScheduleMeeting);

export default itemRoutes