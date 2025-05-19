import { Hono } from "hono";
import { handleAddItemCircle, handleApproveItem, handleCreateCircle, handleJoinCircle } from "../controllers/circle";
import { protectRoute } from "../middlewares/protectRoute";

const circleRoutes = new Hono();

circleRoutes.post("/create", protectRoute, handleCreateCircle);
circleRoutes.post("/join", protectRoute, handleJoinCircle);
circleRoutes.post("/add-item", protectRoute, handleAddItemCircle);
circleRoutes.put("/approve-item", protectRoute, handleApproveItem);
export default circleRoutes; 