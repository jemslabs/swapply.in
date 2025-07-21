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
        items: true,
        skills: true,
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
        items: true,
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
export async function handleGetSwapRequests(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  try {
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return c.json({ msg: "User not found" }, 400);
    }

    const receivedSwaps = await prisma.swapRequest.findMany({
      where: {
        receiverId: user.id,
      },
      include: {
        proposer: true,
        proposerItem: true,
        receiverItem: true,
        receiverSkill: true,
        proposerSkill: true,
      },
    });

    const proposedSwaps = await prisma.swapRequest.findMany({
      where: {
        proposerId: user.id,
      },
      include: {
        receiver: true,
        proposerItem: true,
        receiverItem: true,
        receiverSkill: true,
        proposerSkill: true,
      },
    });

    return c.json({ receivedSwaps, proposedSwaps }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Sevrer Error" }, 500);
  }
}
