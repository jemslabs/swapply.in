import {Hono} from 'hono'
import { protectRoute } from '../middlewares/protectRoute';
import { handleAcceptSwap, handleCompleteSwap, handleConfirmMeeting, handleGetSwap, handleRejectSwap, handleScheduleMeeting, handleSwap } from '../controllers/swap';

const swapRoutes = new Hono()
swapRoutes.post("/", protectRoute, handleSwap);
swapRoutes.get("/:id", protectRoute, handleGetSwap);
swapRoutes.put("/accept/:id", protectRoute, handleAcceptSwap);
swapRoutes.put("/reject/:id", protectRoute, handleRejectSwap);
swapRoutes.post("/schedule-meeting", protectRoute, handleScheduleMeeting);
swapRoutes.put("/confirm-meeting/:swapId", protectRoute, handleConfirmMeeting);
swapRoutes.put("/complete/:id", protectRoute, handleCompleteSwap);

export default swapRoutes;