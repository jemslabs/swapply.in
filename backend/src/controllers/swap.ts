import { Context } from "hono";
import { addPhoneNumberSchema, swapSchema, verifyCodeSchema } from "../lib/zod";
import { prismaClient } from "../lib/prisma";
import { customAlphabet } from "nanoid";
export async function handleSwap(c: Context) {
  const prisma = prismaClient(c);
  const data = await c.req.json();
  const { id } = c.get("user");
  try {
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 400);

    const validatedData = swapSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
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
      return c.json({ msg: "You already have a swap request for this." }, 409);
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
        title: "Received an swap request",
        body: `${user.name} has requested a swap for your item "${receivedThing.title}".`,
        type: "swap.proposal_received",
        category: "SWAP",
        link: `/swap/requests`,
      },
    });

    return c.json({ msg: "Request Sent", swap });
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleAcceptSwap(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const nanoid = customAlphabet("0123456789", 4);
  try {
    const swapId = parseInt(c.req.param("id"));
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 400);

    if (!swapId) {
      return c.json({ msg: "No swap id provided" }, 400);
    }

    const swap = await prisma.swapRequest.findUnique({
      where: {
        id: swapId,
      },
      include: {
        proposerItem: true,
        receiverItem: true,
        receiver: true,
      },
    });

    if (swap.receiverId !== user.id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    if (swap.proposerType === "ITEM" && swap.proposerItem.isSwapped) {
      return c.json({ msg: "The proposed item has already been swapped" }, 400);
    }
    if (swap.receiverType === "ITEM" && swap.receiverItem.isSwapped) {
      return c.json(
        { msg: "The requested item has already been swapped" },
        400
      );
    }
    if (swap.status !== "PENDING") {
      return c.json({ msg: "Swap is no longer pending" }, 400);
    }

    const operations = [
      prisma.swapRequest.update({
        where: { id: swap.id },
        data: { status: "ACCEPTED" },
      }),
    ];

    if (swap.proposerType === "ITEM") {
      operations.push(
        prisma.item.update({
          where: { id: swap.proposerItemId! },
          data: { isSwapped: true },
        })
      );
    }

    if (swap.receiverType === "ITEM") {
      operations.push(
        prisma.item.update({
          where: { id: swap.receiverItemId! },
          data: { isSwapped: true },
        })
      );
    }

    const users = await prisma.user.count();

    if (users < 100) {
      // Find badges that already exist for these users
      const existing = await prisma.badge.findMany({
        where: {
          userId: { in: [swap.proposerId, swap.receiverId] },
          type: "TOP_SWAPPER",
        },
        select: { userId: true },
      });

      const existingIds = existing.map((b: any) => b.userId);

      // Create arrays for new badges and notifications
      const newBadges = [];
      const newNotifications = [];

      if (!existingIds.includes(swap.proposerId)) {
        newBadges.push({ userId: swap.proposerId, type: "TOP_SWAPPER" });
        newNotifications.push({
          userId: swap.proposerId,
          title: "Badge Unlocked",
          body: "You earned the TOP_SWAPPER badge",
          type: "badge.unlocked",
          category: "BADGE",
          link: `/profile/${swap.proposerId}`,
        });
      }

      if (!existingIds.includes(swap.receiverId)) {
        newBadges.push({ userId: swap.receiverId, type: "TOP_SWAPPER" });
        newNotifications.push({
          userId: swap.receiverId,
          title: "Badge Unlocked",
          body: "You earned the TOP_SWAPPER badge",
          type: "badge.unlocked",
          category: "BADGE",
          link: `/profile/${swap.receiverId}`,
        });
      }

      // Only push if there are new ones
      if (newBadges.length > 0) {
        operations.push(prisma.badge.createMany({ data: newBadges }));
        operations.push(
          prisma.notification.createMany({ data: newNotifications })
        );
      }
    }

    const existingProcess = await prisma.swapProcess.findUnique({
      where: { swapRequestId: swap.id },
    });

    if (!existingProcess) {
      const proposerCode = nanoid();
      let receiverCode;
      do {
        receiverCode = nanoid();
      } while (receiverCode === proposerCode);

      operations.push(
        prisma.swapProcess.create({
          data: {
            swapRequestId: swap.id,
            proposerSwapCode: proposerCode,
            receiverSwapCode: receiverCode,
          },
        })
      );
    }

    operations.push(
      prisma.notification.create({
        data: {
          userId: swap.proposerId,
          title: "Your Swap Request Was Accepted",
          body: `${swap.receiver.name} accepted your swap request.`,
          type: "swap.proposal_accepted",
          category: "SWAP",
          link: `/swap/${swap.id}`,
        },
      })
    );
    await prisma.$transaction(operations);

    return c.json({ msg: "Accepted the swap request" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleRejectSwap(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  try {
    const swapId = parseInt(c.req.param("id"));
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 400);

    if (!swapId) {
      return c.json({ msg: "No swap id provided" }, 400);
    }

    const swap = await prisma.swapRequest.findUnique({
      where: {
        id: swapId,
      },
      include: {
        proposerItem: true,
        receiverItem: true,
        receiver: true,
      },
    });

    if (swap.receiverId !== user.id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    if (swap.status !== "PENDING") {
      return c.json({ msg: "Swap is no longer pending" }, 400);
    }

    const operations = [
      prisma.swapRequest.update({
        where: { id: swap.id },
        data: { status: "REJECTED" },
      }),
    ];
    operations.push(
      prisma.notification.create({
        data: {
          userId: swap.proposerId,
          title: "Your Swap Request Was Rejected",
          body: `${swap.receiver.name} rejected your swap request.`,
          type: "swap.proposal_rejected",
          category: "SWAP",
          link: `/swap/${swap.id}`,
        },
      })
    );
    await prisma.$transaction(operations);
    return c.json({ msg: "Rejected the swap request" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleGetSwap(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  try {
    const swapId = parseInt(c.req.param("id"));
    if (!swapId) {
      return c.json({ msg: "No swap id provided" }, 400);
    }

    const swap = await prisma.swapRequest.findUnique({
      where: {
        id: swapId,
      },
      include: {
        proposer: true,
        receiver: true,
        proposerItem: true,
        proposerSkill: true,
        receiverItem: true,
        receiverSkill: true,
        process: true,
      },
    });

    if (!swap) {
      return c.json({ msg: "No swap found for this id" }, 404);
    }

    if (swap.proposerId !== id && swap.receiverId !== id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    return c.json(swap, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleAddPhoneNumber(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  try {
    const data = await c.req.json();
    const validatedData = addPhoneNumberSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { number, swapRequestId } = validatedData.data;

    // Find swap request and ensure it's accepted
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId },
    });
    if (!swapRequest || swapRequest.status !== "ACCEPTED") {
      return c.json({ msg: "Swap Request is not accepted" }, 400);
    }

    const swapProcess = await prisma.swapProcess.findUnique({
      where: {
        swapRequestId: swapRequest.id,
      },
    });
    if (!swapProcess) {
      return c.json({ msg: "You can't continue as you are unauthorized" }, 400);
    }
    if (
      (id === swapRequest.proposerId && swapProcess.proposerPhoneNumber) ||
      (id === swapRequest.receiverId && swapProcess.receiverPhoneNumber)
    ) {
      return c.json({ msg: "You already added your phone number" }, 400);
    }

    // Determine user role and update only their phone number
    const updateData =
      id === swapRequest.proposerId
        ? { proposerPhoneNumber: number }
        : id === swapRequest.receiverId
        ? { receiverPhoneNumber: number }
        : null;

    if (!updateData) {
      return c.json({ msg: "Unauthorized" }, 403);
    }

    await prisma.swapProcess.update({
      where: { swapRequestId: swapRequest.id },
      data: updateData,
    });

    return c.json({ msg: "Phone number added successfully" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleProposerVerifyCode(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  try {
    const data = await c.req.json();
    const validatedData = verifyCodeSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { code, swapProcessId } = validatedData.data;

    const swapProcess = await prisma.swapProcess.findUnique({
      where: { id: swapProcessId },
    });
    if (!swapProcess) {
      return c.json(
        { msg: "You can't continue further as swap request is not accepted" },
        400
      );
    }

    if (swapProcess.isProposerCodeVerified) {
      return c.json({ msg: "Proposer code is already verified" }, 400);
    }

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapProcess.swapRequestId },
    });
    if (!swapRequest || id !== swapRequest.receiverId) {
      return c.json({ msg: "Unauthorized" }, 403);
    }

    if (code !== swapProcess.proposerSwapCode) {
      return c.json({ msg: "Swap Code is invalid" }, 400);
    }

    await prisma.swapProcess.update({
      where: { id: swapProcess.id },
      data: { isProposerCodeVerified: true },
    });

    return c.json({ msg: "Proposer code verified" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleReceiverVerifyCode(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");

  try {
    const data = await c.req.json();
    const validatedData = verifyCodeSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { code, swapProcessId } = validatedData.data;

    const swapProcess = await prisma.swapProcess.findUnique({
      where: { id: swapProcessId },
    });
    if (!swapProcess) {
      return c.json(
        { msg: "You can't continue further as swap request is not accepted" },
        400
      );
    }

    if (swapProcess.isReceiverCodeVerified) {
      return c.json({ msg: "Receiver code is already verified" }, 400);
    }

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapProcess.swapRequestId },
    });
    if (!swapRequest || id !== swapRequest.proposerId) {
      return c.json({ msg: "Unauthorized" }, 403);
    }

    if (code !== swapProcess.receiverSwapCode) {
      return c.json({ msg: "Swap Code is invalid" }, 400);
    }

    await prisma.swapProcess.update({
      where: { id: swapProcess.id },
      data: { isReceiverCodeVerified: true },
    });

    return c.json({ msg: "Receiver code verified" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleMarkAsCompleted(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const swapRequestId = parseInt(c.req.param("id"));
  try {
    const swapRequest = await prisma.swapRequest.findUnique({
      where: {
        id: swapRequestId,
      },
    });
    if (!swapRequest) {
      return c.json({ msg: "Swap request not found" }, 404);
    }
    if (swapRequest.status === "COMPLETED") {
      return c.json({ msg: "Swap request already completed" }, 200);
    }
    if (swapRequest.status !== "ACCEPTED") {
      return c.json({ msg: "This swap request is not accepted" }, 400);
    }
    if (id !== swapRequest.proposerId) {
      return c.json(
        {
          msg: "Unauthorized: Only proposer of this request can Mark as complete",
        },
        400
      );
    }
    const swapProcess = await prisma.swapProcess.findUnique({
      where: {
        swapRequestId: swapRequest.id,
      },
    });
    if (!swapProcess.isProposerCodeVerified) {
      return c.json({ msg: "Proposer code is not verified" }, 400);
    }
    if (!swapProcess.isReceiverCodeVerified) {
      return c.json({ msg: "Receiver code is not verified" }, 400);
    }

    await prisma.swapRequest.update({
      where: {
        id: swapRequest.id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    return c.json({ msg: "Swap request marked as completed" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
