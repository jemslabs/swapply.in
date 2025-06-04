import { Hono } from "hono";
import { protectRoute } from "../middlewares/protectRoute";
import {
  deleteExpiredBoostedItems,
  handleAcceptSwapProposal,
  handleAddItem,
  handleBoostItem,
  handleCancelMeeting,
  handleCancelSwapProposal,
  handleGetBrowseItems,
  handleGetItem,
  handleGetSwap,
  handleRejectSwapProposal,
  handleScheduleMeeting,
  handleSendSwapProposal,
} from "../controllers/item";
import {
  protectItemPro,
  protectProductBoost,
  protectSwapsPro,
} from "../middlewares/protectProRoutes";

const itemRoutes = new Hono();

itemRoutes.post("/add", protectRoute, protectItemPro, handleAddItem);
itemRoutes.get("/browse-items", handleGetBrowseItems);
itemRoutes.get("/get-item", handleGetItem);
itemRoutes.post(
  "/swap-proposal",
  protectRoute,
  protectSwapsPro,
  handleSendSwapProposal
);
itemRoutes.put("/accept-swap-proposal", protectRoute, handleAcceptSwapProposal);
itemRoutes.put("/reject-swap-proposal", protectRoute, handleRejectSwapProposal);
itemRoutes.put("/cancel-swap-proposal", protectRoute, handleCancelSwapProposal);
itemRoutes.get("/get-swap", protectRoute, handleGetSwap);
itemRoutes.post("/schedule-swap-meeting", protectRoute, handleScheduleMeeting);
itemRoutes.put("/cancel-swap-meeting", protectRoute, handleCancelMeeting);

itemRoutes.post("/boost", protectRoute, protectProductBoost, handleBoostItem);
itemRoutes.get("/delete-boosts", deleteExpiredBoostedItems);

export default itemRoutes;
