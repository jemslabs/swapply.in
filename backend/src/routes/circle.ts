import { Hono } from "hono";
import { handleAddItemCircle, handleApproveItem, handleCreateCircle, handleGetCircle, handleGetMyCircles, handleJoinCircle, handleLeaveCircle } from "../controllers/circle";
import { protectRoute } from "../middlewares/protectRoute";

const circleRoutes = new Hono();

circleRoutes.post("/create", protectRoute, handleCreateCircle);
circleRoutes.get("/get-my-circles", protectRoute, handleGetMyCircles);

circleRoutes.post("/join", protectRoute, handleJoinCircle);
circleRoutes.delete("/leave", protectRoute, handleLeaveCircle)
circleRoutes.post("/add-item", protectRoute, handleAddItemCircle);
circleRoutes.put("/approve-item", protectRoute, handleApproveItem);
circleRoutes.get("/get-circle", protectRoute, handleGetCircle);
export default circleRoutes; 