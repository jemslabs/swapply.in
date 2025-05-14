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
      return c.json({ msg: "Invalid Fields" }, 400);
    }

    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return c.json({ msg: "User not found" }, 400);

    const {
      title,
      description,
      category,
      company,
      currencyType,
      currentPrice,
      originalPrice,
      barterType,
      condition,
      hasBill,
      image,
      location,
    } = validatedData.data;
    
    let imageUrl;
    if (image) {
      imageUrl = await uploadToCloudinary(image, "swapply/image", c);
    }
    const newItem = await prisma.item.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        company,
        currencyType,
        currentPrice,
        originalPrice,
        barterType,
        location: barterType === "INPERSON" ? location : null,
        hasBill,
        condition,
        image: imageUrl || "",
      },
    });

    if (!newItem) {
      return c.json({ msg: "Failed to add new item" }, 400);
    }

    return c.json({ msg: "New item added" }, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
