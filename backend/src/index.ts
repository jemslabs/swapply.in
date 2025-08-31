import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth";
import itemRoutes from "./routes/item";
import skillRoutes from "./routes/skill";
import browseRoutes from "./routes/browse";
import swapRoutes from "./routes/swap";
const app = new Hono();

const allowedOrigins = [
  "http://localhost:5173",
  "https://swapply.netlify.app",
  "https://www.swapply.in",
  "https://swapply.in",
];

// CORS & credentials
app.use("*", async (c: Context, next: Next) => {
  c.header("Access-Control-Allow-Credentials", "true");
  return next();
});

app.use(
  "*",
  cors({
    origin: (origin) => (allowedOrigins.includes(origin ?? "") ? origin : ""),
    credentials: true,
  })
);

app.route("/api/auth", authRoutes);
app.route("/api/item", itemRoutes);
app.route("/api/skill", skillRoutes);
app.route("/api/browse", browseRoutes);
app.route("/api/swap", swapRoutes);

export default app;
