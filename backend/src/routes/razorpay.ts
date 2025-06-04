import { Hono } from "hono";
import { handleCreateOrder, handleDeleteExpiredPlans, handleOrderValidate } from "../controllers/razorpay";
import { protectRoute } from "../middlewares/protectRoute";

const razorpayRoutes = new Hono();

razorpayRoutes.post("/create-order", protectRoute, handleCreateOrder);
razorpayRoutes.post("/order/validate",protectRoute, handleOrderValidate);
razorpayRoutes.get("/expired-plans", handleDeleteExpiredPlans);

export default razorpayRoutes;