import { Context } from "hono";
import { prismaClient } from "../lib/prisma";
import { createCircleSchema } from "../lib/zod";
import { uploadToCloudinary } from "../lib/cloudinary";

export async function handleCreateCircle(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const data = await c.req.parseBody();
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    const validatedData = createCircleSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Fields" }, 400);
    }
    const { name, description, image } = validatedData.data;
    let imageUrl;
    if (image) {
      imageUrl = await uploadToCloudinary(image, "swapply/image", c);
    } else {
      imageUrl = null;
    }

    const newCircle = await prisma.circle.create({
      data: {
        name,
        description,
        image: imageUrl,
      },
    });
    if (!newCircle) return c.json({ msg: "Failed to create new circle" }, 400);

    await prisma.circleMember.create({
      data: {
        userId: id,
        circleId: newCircle.id,
        role: "ADMIN",
      },
    });

    return c.json({ msg: "New Circle Created" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleJoinCircle(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const circleId = c.req.query("circleId");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!circleId) return c.json({ msg: "Circle Id not provided" }, 400);
    const parsedCircleId = parseInt(circleId);
    const circle = await prisma.circle.findUnique({
      where: {
        id: parsedCircleId,
      },
    });

    if (!circle) return c.json({ msg: "Circle not found" }, 404);

    const isAlreadyIn = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: {
          userId: user.id,
          circleId: parsedCircleId,
        },
      },
    });

    if (isAlreadyIn)
      return c.json({ msg: "You already are in this circle" }, 400);

    await prisma.circleMember.create({
      data: {
        userId: user.id,
        circleId: circle.id,
        role: "MEMBER",
      },
    });
    return c.json({ msg: "Joined this circle" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleAddItemCircle(c: Context) {
  const prisma = prismaClient(c);
  const { id: userId } = c.get("user");
  const data = await c.req.json();

  try {
    if (!userId) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    const { itemId, circleId } = data;

    if (!itemId || !circleId) {
      return c.json({ msg: "Item ID and Circle ID are required" }, 400);
    }

    const parsedItemId = parseInt(itemId);
    const item = await prisma.item.findUnique({
      where: { id: parsedItemId },
    });
    if (!item) {
      return c.json({ msg: "Item not found" }, 400);
    }

    const parsedCircleId = parseInt(circleId);
    const circle = await prisma.circle.findUnique({
      where: { id: parsedCircleId },
    });
    if (!circle) return c.json({ msg: "Circle not found" }, 404);

    const isMember = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: {
          userId,
          circleId,
        },
      },
    });
    if (!isMember) {
      return c.json({ msg: "You are not a member of this circle" }, 403);
    }

    const existingCircleItem = await prisma.circleItem.findFirst({
      where: {
        itemId,
        circleId,
      },
    });
    if (existingCircleItem) {
      return c.json({ msg: "Item already added to this circle" }, 400);
    }

    await prisma.circleItem.create({
      data: {
        itemId,
        circleId,
        userId,
        isApproved: isMember.role === "ADMIN",
      },
    });

    return c.json({ msg: "Item added to circle successfully" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleApproveItem(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const circleItemId = c.req.query("circleItemId");

  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);

    if (!circleItemId) return c.json({ msg: "Item id not provided" }, 400);
    const parsedId = parseInt(circleItemId);
    if (isNaN(parsedId)) return c.json({ msg: "Invalid item id" }, 400);

    const circleItem = await prisma.circleItem.findUnique({
      where: { id: parsedId },
    });
    if (!circleItem) return c.json({ msg: "Circle item not found" }, 404);

    const member = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: {
          userId: user.id,
          circleId: circleItem.circleId,
        },
      },
    });
    if (!member)
      return c.json({ msg: "You are not a member of this circle" }, 400);
    if (member.role !== "ADMIN") {
      return c.json({ msg: "Only admin can approve items" }, 400);
    }

    await prisma.circleItem.update({
      where: { id: parsedId },
      data: { isApproved: true },
    });

    return c.json({ msg: "Item got approved" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetMyCircles(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);

    const myCircles = await prisma.circleMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        circle: {
          include: {
            members: true,
          },
        },
      },
    });
    if (myCircles.length === 0) {
      return c.json({ msg: "No circles found" }, 404);
    }

    return c.json(myCircles, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetCircle(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const circleId = c.req.query("circleId");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!circleId) return c.json({ msg: "Circle id not provided" }, 400);
    const parsedCircleId = parseInt(circleId);

    const circle = await prisma.circle.findUnique({
      where: {
        id: parsedCircleId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        items: {
          include: {
            item: true,
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!circle) return c.json({ msg: "Circle Not found" }, 404);
    return c.json(circle, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleLeaveCircle(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const circleId = c.req.query("circleId");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!circleId) return c.json({ msg: "Circle Id not provided" }, 400);
    const parsedCircleId = parseInt(circleId);
    const circle = await prisma.circle.findUnique({
      where: {
        id: parsedCircleId,
      },
    });

    if (!circle) return c.json({ msg: "Circle not found" }, 404);

    const isAlreadyIn = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: {
          userId: user.id,
          circleId: parsedCircleId,
        },
      },
    });

    if (!isAlreadyIn)
      return c.json({ msg: "You are not part of this circle" }, 400);
    if(isAlreadyIn.role === "ADMIN") {
      return c.json({msg: "Admins cannot leave this group"}, 400);
    }

    await prisma.circleMember.delete({
      where: {
        id: isAlreadyIn.id
      }
    });
    
    return c.json({ msg: "Leaved this circle" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}