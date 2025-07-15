import {Hono} from 'hono'
import { protectRoute } from '../middlewares/protectRoute';
import { handleSwap } from '../controllers/swap';

const swapRoutes = new Hono()
swapRoutes.post("/", protectRoute, handleSwap)

export default swapRoutes;