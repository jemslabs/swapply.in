import { PrismaClient } from "@prisma/client/edge.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";


let prisma: any;
export function prismaClient(c: Context) {
  if (!prisma) {
    prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  }
  return prisma;
}