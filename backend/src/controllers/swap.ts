import { Context } from "hono";
import { swapSchema } from "../lib/zod";
import { prismaClient } from "../lib/prisma";

export async function handleSwap(c: Context) {
  const prisma = prismaClient(c);
  const data = await c.req.json();
  const { id } = c.get("user");

  try {
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "Unauthorised" }, 401);

    const validatedData = swapSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json(
        { msg: "Invalid Input" },
        400
      );
    }

    const { proposerType, receiverType, receiverId, proposedId, receivedId } =
      validatedData.data;

    const proposedThing =
      proposerType === "ITEM"
        ? await prisma.item.findUnique({ where: { id: proposedId } })
        : await prisma.skill.findUnique({ where: { id: proposedId } });

    const receivedThing =
      receiverType === "ITEM"
        ? await prisma.item.findUnique({ where: { id: receivedId } })
        : await prisma.skill.findUnique({ where: { id: receivedId } });

    if (!proposedThing || proposedThing.userId !== id) {
      return c.json({ msg: "You do not own the proposed asset." }, 403);
    }

    if (receivedThing.userId === id) {
      return c.json({ msg: "You can't send swap request to yourself" }, 400);
    }
    if (!receivedThing || receivedThing.userId !== receiverId) {
      return c.json(
        { msg: "Invalid receiver asset or mismatched receiver ID." },
        400
      );
    }

    if (proposerType === "ITEM" && proposedThing.isSwapped) {
      return c.json({ msg: "Proposed Item is already swapped" }, 400);
    }

    if (receiverType === "ITEM" && receivedThing.isSwapped) {
      return c.json({ msg: "Requested Item is already swapped" }, 400);
    }

    const existingSwap = await prisma.swapRequest.findFirst({
      where: {
        proposerId: id,
        receiverId,
        proposerItemId: proposerType === "ITEM" ? proposedId : undefined,
        proposerSkillId: proposerType === "SKILL" ? proposedId : undefined,
        receiverItemId: receiverType === "ITEM" ? receivedId : undefined,
        receiverSkillId: receiverType === "SKILL" ? receivedId : undefined,
        status: "PENDING",
      },
    });

    if (existingSwap) {
      return c.json(
        { msg: "You already have a swap request for this." },
        409
      );
    }
    const swap = await prisma.swapRequest.create({
      data: {
        proposerId: id,
        receiverId,
        proposerType,
        receiverType,
        proposerItemId: proposerType === "ITEM" ? proposedId : null,
        proposerSkillId: proposerType === "SKILL" ? proposedId : null,
        receiverItemId: receiverType === "ITEM" ? receivedId : null,
        receiverSkillId: receiverType === "SKILL" ? receivedId : null,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: receivedThing.userId,
        title: "Received an swap proposal",
        body: `${user.name} has proposed a swap for your item "${receivedThing.title}".`,
        type: "swap.proposal_received",
        category: "SWAP",
        link: `/swap-requests`,
      },
    });

    return c.json({ msg: "Request Sent", swap });
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
