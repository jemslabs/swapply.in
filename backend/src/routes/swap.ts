import {Hono} from 'hono'
import { protectRoute } from '../middlewares/protectRoute';
import { handleAcceptSwap, handleAddPhoneNumber, handleGetSwap, handleMarkAsCompleted, handleProposerVerifyCode, handleReceiverVerifyCode, handleRejectSwap, handleSwap } from '../controllers/swap';

const swapRoutes = new Hono()
swapRoutes.post("/", protectRoute, handleSwap);
swapRoutes.get("/:id", protectRoute, handleGetSwap);
swapRoutes.put("/accept/:id", protectRoute, handleAcceptSwap);
swapRoutes.put("/reject/:id", protectRoute, handleRejectSwap);


swapRoutes.put("/add-phone-number", protectRoute, handleAddPhoneNumber);
swapRoutes.put("/verify-proposer-code", protectRoute, handleProposerVerifyCode);
swapRoutes.put("/verify-receiver-code", protectRoute, handleReceiverVerifyCode);
swapRoutes.put("/mark-as-completed/:id", protectRoute, handleMarkAsCompleted);


export default swapRoutes;