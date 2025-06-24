import { Context } from "hono";
import { authSchema } from "../lib/zod";
import { prismaClient } from "../lib/prisma";

export async function handleAuth(c: Context) {
  const prisma = prismaClient(c);
  try {
    const data = await c.req.json();

    const validatedData = authSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { name, email, image, clerkId } = validatedData.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return c.json(existingUser, 200);
    }
    if (!name) {
      return c.json({ msg: "Name is required" }, 400);
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        clerkId,
      },
    });
    if (!newUser) return c.json({ msg: "Failed to create new user" }, 400);

    return c.json(newUser, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetUser(c: Context) {
  const prisma = prismaClient(c);
  try {
    const { id } = c.get("user");
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            boostedItem: true,
          },
        },
        proposedSwaps: {
          include: {
            receiver: true,
            proposer: true,
            proposedItem: true,
            receiverItem: true,
          },
        },
        receivedSwaps: {
          include: {
            receiver: true,
            proposer: true,
            proposedItem: true,
            receiverItem: true,
          },
        },
        circles: {
          include: {
            circle: true,
          },
        },
        plan: true,
        notifications: true,
      },
    });
    if (!user) return c.json({ msg: "User doesn't exists" }, 400);
    return c.json(user, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetPublicUser(c: Context) {
  const prisma = prismaClient(c);
  const id = c.req.query("id");
  try {
    if (!id) return c.json({ msg: "User Id not provided" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        items: {
          include: {
            boostedItem: true,
          },
        },
        circles: {
          where: {
            role: "ADMIN",
          },

          include: {
            circle: {
              include: {
                members: true,
              },
            },
          },
        },
        plan: true,
      },
    });
    if (!user) {
      return c.json({ msg: "User not found" }, 404);
    }

    return c.json(user, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleUpgradeUserPlan(c: Context) {
  const { event, payload } = await c.req.json();
  const prisma = prismaClient(c);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: payload?.payment?.entity?.email,
      },
    });

    if (!user) return c.json({ msg: "User not found" }, 404);

    const isPlanActive = await prisma.proPlan.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (isPlanActive) {
      return c.json({ msg: "Pro plan is already active" }, 400);
    }

    if (event.payment.captured) {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      await prisma.proPlan.create({
        data: {
          userId: user.id,
          expiresAt: now,
        },
      });

      return c.json({ msg: "Pro plan activated" }, 200);
    }

    if (event.payment.failed) {
      return c.json({ msg: "Payment Failed" }, 500);
    }

    return c.json({ msg: "Unexpected event got triggered" }, 500);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
