import { Context, Next } from "hono";
import { prismaClient } from "../lib/prisma";


export async function protectItemPro(c: Context, next: Next) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  if (!id) return c.json({ msg: "Unauthorised" }, 400);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      plan: true,
      items: true,
    },
  });

  if (!user) return c.json({ msg: "User not found" }, 404);

  const itemCount = user.items.length;
  const isPro = !!user.plan;

  if (!isPro && itemCount >= 5) {
    return c.json(
      { msg: "Free plan limit reached. Upgrade to Pro to add more items." },
      400
    );
  }

  return next();
}

export async function protectSwapsPro(c: Context, next: Next) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  if (!id) return c.json({ msg: "Unauthorised" }, 400);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      plan: true,
    },
  });

  if (!user) return c.json({ msg: "User not found" }, 404);

  const totalAcceptedSwaps = await prisma.swapProposal.count({
    where: {
      status: "ACCEPTED",
      OR: [{ proposerId: user.id }, { receiverId: user.id }],
    },
  });

  const isPro = !!user.plan;

  if (!isPro && totalAcceptedSwaps >= 2) {
    return c.json(
      {
        msg: "Free plan swap limit reached. Upgrade to Pro to make more swaps.",
      },
      400
    );
  }

  return next();
}

export async function protectProductBoost(c: Context, next: Next) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  if (!id) return c.json({ msg: "Unauthorised" }, 400);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      plan: true,
    },
  });

  if (!user) return c.json({ msg: "User not found" }, 404);
  const isPro = !!user.plan;

  if (!isPro) {
    return c.json(
      {
        msg: "Boosting is available for Pro users only. Upgrade to boost products.",
      },
      400
    );
  }

  return next();
}
