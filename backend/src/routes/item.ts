import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import { handleAcceptSwapProposal, handleAddItem, handleCancelMeeting, handleCancelSwapProposal, handleGetBrowseItems, handleGetItem, handleGetSwap, handleRejectSwapProposal, handleScheduleMeeting, handleSendSwapProposal } from "../controllers/item";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, handleAddItem);
itemRoutes.get("/browse-items", handleGetBrowseItems);
itemRoutes.get("/get-item",handleGetItem);
itemRoutes.post("/swap-proposal", protectRoute,handleSendSwapProposal);
itemRoutes.put("/accept-swap-proposal", protectRoute, handleAcceptSwapProposal);
itemRoutes.put("/reject-swap-proposal", protectRoute, handleRejectSwapProposal);
itemRoutes.put("/cancel-swap-proposal", protectRoute, handleCancelSwapProposal);
itemRoutes.get("/get-swap", protectRoute, handleGetSwap);
itemRoutes.post("/schedule-swap-meeting", protectRoute, handleScheduleMeeting);
itemRoutes.put("/cancel-swap-meeting", protectRoute,handleCancelMeeting )

export default itemRoutes