import { Context } from "hono";
import { prismaClient } from "../lib/prisma";
import { addSkillSchema } from "../lib/zod";
import { uploadToCloudinary } from "../lib/cloudinary";

export async function handleAddSkill(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const data = await c.req.parseBody();
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return c.json({ msg: "User not found" }, 400);
    const validatedData = addSkillSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Data" }, 400);
    }

    const { title, image, category, location, isRemote, lookingFor, duration } =
      validatedData.data;
    let imageUrl;
    if (image) {
      imageUrl = await uploadToCloudinary(image, "swapply/image", c);
    } else {
      imageUrl = null;
    }

    const newSkill = await prisma.skill.create({
      data: {
        userId: user.id,
        title,
        image: imageUrl || null,
        category,
        location,
        isRemote,
        lookingFor,
        duration,
      },
    });

    if (!newSkill) {
      return c.json({ msg: "Failed to add skill" }, 400);
    }

    return c.json({ msg: "Skill added successfully", data: newSkill }, 200);
  } catch {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}


