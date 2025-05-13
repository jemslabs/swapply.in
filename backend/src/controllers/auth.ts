import { Context } from "hono";
import { authSchema } from "../lib/zod";
import { prismaClient } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/generateToken";


export async function handleAuth(c: Context) {
  const prisma = prismaClient(c);
  try {
    const data = await c.req.json();

    const validatedData = authSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { name, email, password } = validatedData.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return c.json({ msg: "Incorrect password" }, 401);
      }

      await generateTokenAndSetCookie(existingUser.id, c);
      return c.json(existingUser, 200);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!name) {
      return c.json({ msg: "Name is required" }, 400);
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    if (!newUser) return c.json({ msg: "Failed to create new user" }, 400);
    await generateTokenAndSetCookie(newUser?.id, c);

    return c.json(newUser, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
