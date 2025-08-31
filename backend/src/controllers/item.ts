import { Context } from "hono";
import { prismaClient } from "../lib/prisma";
import { addItemSchema } from "../lib/zod";
import { uploadToCloudinary } from "../lib/cloudinary";

export async function handleAddItem(c: Context) {
  const prisma = prismaClient(c);

  try {
    const { id } = c.get("user");
    const data = await c.req.parseBody();
    const validatedData = addItemSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Data" }, 400);
    }

    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return c.json({ msg: "User not found" }, 400);

    const {
      title,
      image,
      condition,
      category,
      price,
      hasBill,
      location,
      lookingFor,
    } = validatedData.data;

    let imageUrl;
    if (image) {
      imageUrl = await uploadToCloudinary(image, "swapply/image", c);
    } else {
      imageUrl = null;
    }
    const newItem = await prisma.item.create({
      data: {
        userId: user.id,
        title,
        price,
        category,
        location,
        hasBill,
        condition,
        image: imageUrl || null,
        lookingFor,
      },
    });

    if (!newItem) {
      return c.json({ msg: "Failed to add new item" }, 400);
    }

    return c.json({ msg: "Item added successfully", data: newItem }, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetItem(c: Context) {
  const prisma = prismaClient(c);
  try {
    const id = c.req.query("id");
    if (!id) return c.json({ msg: "Id not provided" }, 400);
    const parsedId = parseInt(id);

    const item = await prisma.item.findUnique({
      where: {
        id: parsedId,
      },
      include: {
        user: true,
      },
    });

    if (!item) return c.json({ msg: "Item not found" }, 200);

    return c.json(item, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
