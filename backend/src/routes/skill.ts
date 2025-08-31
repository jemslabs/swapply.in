import { Hono } from "hono";
import {protectRoute} from '../middlewares/protectRoute';
import { handleAddSkill, handleGetSkill } from "../controllers/skill";

const skillRoutes = new Hono();

skillRoutes.post("/add", protectRoute, handleAddSkill);
skillRoutes.get("/get-skill", handleGetSkill);

export default skillRoutes;