import { Context } from "hono";
import { prismaClient } from "../lib/prisma";
import {
  addItemSchema,
  scheduleProposalMeeting,
  swapProposalSchema,
} from "../lib/zod";
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

      condition,
      hasBill,
      image,
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
        description,
        category,
        company,
        currencyType,
        currentPrice,
        originalPrice,
        hasBill,
        condition,
        image: imageUrl || null,
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

export async function handleGetBrowseItems(c: Context) {
  const prisma = prismaClient(c);
  try {
    const category = c.req.query("category");
    const query = c.req.query("query")?.replace(/^"|"$/g, "");
    const fromPrice = parseFloat(c.req.query("fromPrice") || "0");
    const toPrice = parseFloat(c.req.query("toPrice") || "99999999");
    const currencyType = c.req.query("currencyType");

    const { id } = c.get("user");
    if (!id) {
      return c.json({ msg: "Unauthorized" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);

    const filters: any = {
      userId: {
        not: user?.id,
      },
      currentPrice: {
        gte: fromPrice,
        lte: toPrice,
      },
      isSwapped: false,
    };

    if (query) {
      filters.title = {
        contains: query,
        mode: "insensitive",
      };
    }

    if (category) {
      filters.category = category.toUpperCase();
    }

    if (currencyType) {
      filters.currencyType = currencyType;
    } else {
      filters.currencyType = "INR";
    }
    const items = await prisma.item.findMany({
      where: filters,
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ items }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleGetMyItems(c: Context) {
  const prisma = prismaClient(c);
  try {
    const { id } = c.get("user");
    if (!id) {
      return c.json({ msg: "Unauthorized" }, 400);
    }

    const items = await prisma.item.findMany({
      where: {
        userId: id,
      },
    });

    if (items.length > 0) {
      return c.json(items, 200);
    } else {
      return c.json([], 200);
    }
  } catch (error) {
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

export async function handleSendSwapPropsal(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const data = await c.req.json();
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return c.json({ msg: "User not found" }, 404);

    const validatedData = swapProposalSchema.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid or missing fields" }, 400);
    }

    const { receiverId, receiverItemId, proposedItemId, message } =
      validatedData.data;
    if (receiverId === id) {
      return c.json({ msg: "You cannot propose a swap to yourself" }, 400);
    }
    const recieverItem = await prisma.item.findUnique({
      where: {
        id: receiverItemId,
      },
    });
    if (recieverItem.isSwapped) {
      return c.json({ msg: "This item is already swapped" });
    }

    if (recieverItem.userId !== receiverId) {
      return c.json({ msg: "The reciever is not actual item owner" }, 400);
    }

    const proposedItem = await prisma.item.findUnique({
      where: {
        id: proposedItemId,
      },
    });
    if (proposedItem.isSwapped) {
      return c.json({ msg: "Your item is already swapped" });
    }

    if (proposedItem.userId !== user?.id) {
      return c.json({ msg: "Unauthorized to do this" }, 400);
    }

    await prisma.swapProposal.create({
      data: {
        receiverId,
        proposerId: user?.id,
        receiverItemId,
        proposedItemId,
        message,
      },
    });

    return c.json({ msg: "Proposal Sent" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleAcceptSwapProposal(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const proposalId = c.req.query("id");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);

    if (!proposalId) return c.json({ msg: "Missing proposal id" }, 400);
    const parsedProposalId = parseInt(proposalId);
    const proposal = await prisma.swapProposal.findUnique({
      where: {
        id: parsedProposalId,
      },
    });

    if (!proposal) return c.json({ msg: "No swap proposal found" }, 404);
    if (user.id !== proposal.receiverId) {
      return c.json({ msg: "Only reciever can accept the swap proposal" }, 400);
    }
    if (proposal.status !== "PENDING") {
      return c.json({ msg: "This proposal has already been processed." }, 400);
    }

    await prisma.$transaction([
      prisma.swapProposal.update({
        where: { id: proposal.id },
        data: { status: "ACCEPTED" },
      }),
      prisma.item.update({
        where: { id: proposal.proposedItemId },
        data: { isSwapped: true },
      }),
      prisma.item.update({
        where: { id: proposal.receiverItemId },
        data: { isSwapped: true },
      }),
    ]);

    return c.json({ msg: "Accepted swap proposal" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleRejectSwapProposal(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const proposalId = c.req.query("id");

  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return c.json({ msg: "User not found" }, 404);

    if (!proposalId) return c.json({ msg: "Missing proposal id" }, 400);
    const parsedProposalId = parseInt(proposalId);
    if (isNaN(parsedProposalId))
      return c.json({ msg: "Invalid proposal id" }, 400);

    const proposal = await prisma.swapProposal.findUnique({
      where: { id: parsedProposalId },
    });
    if (!proposal) return c.json({ msg: "No swap proposal found" }, 404);

    if (proposal.status !== "PENDING") {
      return c.json({ msg: "This proposal has already been processed." }, 400);
    }

    if (user.id !== proposal.receiverId) {
      return c.json({ msg: "Only receiver can reject the swap proposal" }, 403);
    }

    await prisma.swapProposal.update({
      where: { id: proposal.id },
      data: { status: "REJECTED" },
    });

    return c.json({ msg: "Rejected swap proposal" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleCancelSwapProposal(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const proposalId = c.req.query("id");

  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!proposalId) return c.json({ msg: "Missing proposal id" }, 400);
    const parsedProposalId = parseInt(proposalId);
    if (isNaN(parsedProposalId))
      return c.json({ msg: "Invalid proposal id" }, 400);

    const proposal = await prisma.swapProposal.findUnique({
      where: { id: parsedProposalId },
    });
    if (!proposal) return c.json({ msg: "No swap proposal found" }, 404);

    if (user.id !== proposal.proposerId && user.id !== proposal.receiverId) {
      return c.json({ msg: "Unauthorized to cancel the swap proposal" }, 400);
    }
    if (proposal.status === "REJECTED" || proposal.status === "CANCELLED") {
      return c.json(
        { msg: `Cannot cancel a ${proposal.status.toLowerCase()} proposal.` },
        400
      );
    }

    const swapInPersonRecord = await prisma.swapInperson.findUnique({
      where: {
        swapProposalId: proposal.id,
      },
    });

    if (swapInPersonRecord) {
      await prisma.swapInperson.delete({
        where: {
          swapProposalId: proposal.id,
        },
      });
    }

    await prisma.$transaction([
      prisma.swapProposal.update({
        where: { id: proposal.id },
        data: { status: "CANCELLED" },
      }),
      prisma.item.update({
        where: { id: proposal.proposedItemId },
        data: { isSwapped: false },
      }),
      prisma.item.update({
        where: { id: proposal.receiverItemId },
        data: { isSwapped: false },
      }),
    ]);
    return c.json({ msg: "Swap Proposal Cancelled" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetSwap(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const swapId = c.req.query("swapId");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!swapId) return c.json({ msg: "Swap Id not provided" }, 400);
    const parsedSwapId = parseInt(swapId);

    const swapProposal = await prisma.swapProposal.findUnique({
      where: {
        id: parsedSwapId,
      },
      include: {
        proposer: true,
        receiver: true,
        proposedItem: true,
        receiverItem: true,
        swapInperson: true,
      },
    });
    if (!swapProposal) return c.json({ msg: "No swap proposal found" }, 404);
    if (
      swapProposal.receiverId !== user?.id &&
      swapProposal.proposerId !== user?.id
    ) {
      return c.json({ msg: "Unauthorized" }, 400);
    }

    return c.json(swapProposal, 200);
  } catch (error) {
    console.error(error);
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleScheduleMeeting(c: Context) {
  const prisma = prismaClient(c);
  const { id } = c.get("user");
  const data = await c.req.json();
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    const validatedData = scheduleProposalMeeting.safeParse(data);
    if (!validatedData.success) {
      return c.json({ msg: "Invalid or missing fields" }, 400);
    }
    const { date, swapProposalId, meetingLocation, notes, time } =
      validatedData.data;

    const swapProposal = await prisma.swapProposal.findUnique({
      where: {
        id: swapProposalId,
      },
    });
    if (!swapProposal) return c.json({ msg: "SwapProposal not found" }, 404);
    if (
      swapProposal.receiverId !== user?.id &&
      swapProposal.proposerId !== user?.id
    ) {
      return c.json({ msg: "Unauthorized" }, 400);
    }

    await prisma.swapInperson.upsert({
      where: {
        swapProposalId,
      },
      update: {
        date,
        meetingLocation,
        notes,
        time,
        meetingStatus: "RESHEDULED",
      },
      create: {
        date,
        meetingLocation,
        notes,
        time,
        meetingStatus: "SCHEDULED",
        swapProposalId,
      },
    });

    return c.json({ msg: "Success" }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleCancelMeeting(c: Context) {
  const prisma = prismaClient(c);
  const inpersonId = c.req.query("inpersonId");
  const { id } = c.get("user");
  try {
    if (!id) return c.json({ msg: "Unauthorized" }, 400);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return c.json({ msg: "User not found" }, 404);
    if (!inpersonId)
      return c.json({ msg: "Missing in-person meeting id" }, 400);
    const inpersonMeeting = await prisma.swapInperson.findUnique({
      where: {
        id: parseInt(inpersonId),
      },
      include: {
        swapProposal: true,
      },
    });
    if (!inpersonMeeting)
      return c.json(
        { msg: "No in-person meeting for this swap proposal" },
        404
      );
    if (
      user.id !== inpersonMeeting.swapProposal.proposerId &&
      user.id !== inpersonMeeting.swapProposal.receiverId
    ) {
      return c.json({ msg: "Unauthorized to cancel the meeting" }, 400);
    }

    await prisma.swapInperson.update({
      where: {
        id: inpersonMeeting.id
      },
      data: {
        meetingStatus: "CANCELLED"
      }
    })
    return c.json({msg: "Canceled In-Person Meeting"}, 200)
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
