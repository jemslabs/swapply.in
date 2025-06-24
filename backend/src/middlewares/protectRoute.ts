import { Context, Next } from "hono";
import { verifyToken } from "@clerk/backend";
import { prismaClient } from "../lib/prisma";

export async function protectRoute(c: Context, next: Next) {
  const prisma = prismaClient(c);
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ msg: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const { userId } = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    });
    if (!userId) return c.json({ msg: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId
      }
    });
    
    if(!user) return c.json({msg: "User not found"}, 400)

    c.set("user", { id: user.id });

    return next();
  } catch {
    return c.json({ msg: "Unauthorized" }, 401);
  }
}
