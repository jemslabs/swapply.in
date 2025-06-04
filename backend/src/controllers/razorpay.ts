import { Context } from "hono";
import { prismaClient } from "../lib/prisma";

export async function handleCreateOrder(c: Context) {
  try {
    const { amount, currency } = await c.req.json();
    const prisma = prismaClient(c);
    const { id } = c.get("user");

    if (!id) {
      return c.json({ msg: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return c.json({ msg: "User not found" }, 404);
    }

    const key_id = c.env.RAZORPAY_KEY_ID;
    const key_secret = c.env.RAZORPAY_KEY_SECRET;
    const receipt = `receipt_${user.id}_${Date.now()}`;

    const authHeader = "Basic " + btoa(`${key_id}:${key_secret}`);

    const body = {
      amount: amount * 100, // in paise
      currency,
      receipt,
    };

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return c.json({ msg: "Failed to create Razorpay order"}, 400);
    }

    return c.json(data, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error"}, 500);
  }
}
export async function handleOrderValidate(c: Context) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    await c.req.json();
  const { id } = c.get("user");
  const prisma = prismaClient(c);
  const key_secret = c.env.RAZORPAY_KEY_SECRET;
  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key_secret);
    const messageData = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );
    const actualSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);
    const isPlanActive = await prisma.proPlan.findUnique({
      where: { userId: user.id },
    });
    if (isPlanActive) {
      return c.json({ msg: "Pro plan is already active" }, 400);
    }
    if (actualSignature === razorpay_signature) {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);

      await prisma.proPlan.create({
        data: {
          userId: user.id,
          expiresAt: now,
        },
      });

      return c.json({ success: true, message: "Pro plan activated" }, 200);
    } else {
      return c.json({ success: false, message: "Invalid signature." }, 400);
    }
  } catch (error) {
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
}

export async function handleDeleteExpiredPlans(c: Context) {
  const prisma = prismaClient(c);
  const now = new Date();
  try {
    await prisma.proPlan.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    return c.json({ msg: "Deleted all expired plans" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
