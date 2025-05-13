import { Context, Hono, Next } from 'hono'
import { cors } from "hono/cors";
import authRoutes from './routes/auth'

const app = new Hono();
app.use("*", async (c: Context, next: Next) => {
  c.header("Access-Control-Allow-Origin", "http://localhost:5173");
  c.header("Access-Control-Allow-Credentials", "true");
  return next();
});
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.route("/api/auth", authRoutes);


export default app