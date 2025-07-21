import {Hono} from 'hono'
import { protectRoute } from '../middlewares/protectRoute';
import { handleAcceptSwap, handleGetSwap, handleRejectSwap, handleSwap } from '../controllers/swap';

const swapRoutes = new Hono()
swapRoutes.post("/", protectRoute, handleSwap);
swapRoutes.get("/:id", protectRoute, handleGetSwap);
swapRoutes.put("/accept/:id", protectRoute, handleAcceptSwap);
swapRoutes.put("/reject/:id", protectRoute, handleRejectSwap);

export default swapRoutes;