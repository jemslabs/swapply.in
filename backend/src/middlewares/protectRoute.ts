import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export async function protectRoute(c: Context, next: Next) {
  try {
    const token = getCookie(c, "token");
    if (!token) {
      return c.json({ msg: "Unauthorized" }, 401);
    }
    const payload = await verify(token, c.env.JWT_SECRET);
    const { id } = payload;
    c.set("user", { id });
    return next();
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
