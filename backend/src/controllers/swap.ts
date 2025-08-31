import { Context } from "hono";
import { meetingSchema, swapSchema } from "../lib/zod";
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
        meeting: true
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

export async function handleScheduleMeeting(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const data = await c.req.json();
  try {
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }
    const validatedData = meetingSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid Input" }, 400);
    }

    const { swapId, date, location, type, meetingLink } = validatedData.data;

    const swap = await prisma.swapRequest.findUnique({
      where: {
        id: swapId,
      },
    });
    if (!swap) {
      return c.json({ msg: "Swap request doesn't exist" }, 404);
    }

    if (id !== swap.proposerId) {
      return c.json({ msg: "Unauthorised" }, 400);
    }
    const existingMeeting = await prisma.swapMeeting.findUnique({
      where: { swapId: swap.id },
    });
    if (existingMeeting) {
      return c.json({ msg: "Meeting already scheduled" }, 400);
    }
    const meeting = await prisma.swapMeeting.create({
      data: {
        swapId: swap.id,
        date,
        location: type === "INPERSON" ? location : null,
        meetingLink: type === "ONLINE" ? meetingLink : null,
        type,
      },
    });
    if (!meeting) {
      return c.json({ msg: "Failed to schedule meeting" }, 400);
    }

    await prisma.notification.create({
      data: {
        userId: swap.receiverId,
        title: "Meeting Scheduled",
        body: `A meeting for your swap has been scheduled`,
        type: "meeting.scheduled",
        category: "MEETING",
        link: `/swap/${swap?.id}`,
      },
    });
    return c.json({ msg: "Meeting Scheduled" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleConfirmMeeting(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const swapId = parseInt(c.req.param("swapId"));
  try {
    if (!id) {
      return c.json({ msg: "Unauthorised" }, 400);
    }
    const swap = await prisma.swapRequest.findUnique({
      where: {
        id: swapId,
      },
    });
    if (!swap) {
      return c.json({ msg: "Swap request doesn't exist" }, 404);
    }

    if (id !== swap.receiverId) {
      return c.json({ msg: "Unauthorised" }, 400);
    }
    const existingMeeting = await prisma.swapMeeting.findUnique({
      where: { swapId: swap.id },
    });
    if (!existingMeeting) {
      return c.json(
        {
          msg: "Meeting is not scheduled. Wait for proposer to schedule this meeting",
        },
        400
      );
    }

    await prisma.swapMeeting.update({
      where: {
        id: existingMeeting.id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return c.json({ msg: "Meeting Confirmed" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleCompleteSwap(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const swapId = Number(c.req.param("id"));

  if (!id) {
    return c.json({ msg: "Unauthorised" }, 400);
  }

  if (isNaN(swapId)) {
    return c.json({ msg: "Invalid swap ID" }, 400);
  }

  try {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
      include: {
        meeting: true
      }
    });

    if (!swap) {
      return c.json({ msg: "Swap request doesn't exist" }, 404);
    }

    if (id !== swap.proposerId) {
      return c.json({ msg: "Unauthorised" }, 400);
    }

    if (swap.status !== "ACCEPTED") {
      return c.json({ msg: "Swap request is not accepted" }, 400);
    }


    if (!swap.meeting || swap.meeting.status !== "CONFIRMED") {
      return c.json({ msg: "Meeting not confirmed yet" }, 400);
    }

    await prisma.swapRequest.update({
      where: { id: swap.id },
      data: { status: "COMPLETED" },
    });
    return c.json({ msg: "Swapped!" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
