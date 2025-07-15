import { Hono } from "hono";
import {protectRoute} from '../middlewares/protectRoute';
import { handleAddSkill } from "../controllers/skill";

const skillRoutes = new Hono();

skillRoutes.post("/add", protectRoute, handleAddSkill);


export default skillRoutes;