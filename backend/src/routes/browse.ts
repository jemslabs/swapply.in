import { Hono } from "hono";
import { handleGetAll, handleGetBrowseItems, handleGetBrowseSkills } from "../controllers/browse";

const browseRoutes = new Hono();
browseRoutes.get("/items", handleGetBrowseItems);
browseRoutes.get("/skills", handleGetBrowseSkills);
browseRoutes.get("/all", handleGetAll);

export default browseRoutes;