import { Context } from "hono";
import { prismaClient } from "../lib/prisma";
import { SkillCategory, ItemCategory } from "@prisma/client";
export async function handleGetAll(c: Context) {
  const prisma = prismaClient(c);
  try {
    const query = c.req.query("query")?.replace(/^"|"$/g, "").trim();
    const isValidSkillCategory = Object.values(SkillCategory).includes(
      query?.toUpperCase() as SkillCategory
    );
    const isValidItemCategory = Object.values(ItemCategory).includes(
      query?.toUpperCase() as ItemCategory
    );

    const skills = await prisma.skill.findMany({
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              ...(isValidSkillCategory
                ? [
                    {
                      category: {
                        equals: query.toUpperCase() as SkillCategory,
                      },
                    },
                  ]
                : []),
              {
                location: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    const items = await prisma.item.findMany({
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              ...(isValidItemCategory
                ? [
                    {
                      category: {
                        equals: query.toUpperCase() as ItemCategory,
                      },
                    },
                  ]
                : []),
              {
                location: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    const skillsWithType = skills.map((s: any) => ({ ...s, type: "skill" }));
    const itemsWithType = items.map((i: any) => ({ ...i, type: "item" }));

    const combined = [...skillsWithType, ...itemsWithType];
    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ results: combined }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}

export async function handleGetBrowseSkills(c: Context) {
  const prisma = prismaClient(c);
  try {
    const query = c.req.query("query")?.replace(/^"|"$/g, "").trim();
    const isValidSkillCategory = Object.values(SkillCategory).includes(
      query?.toUpperCase() as SkillCategory
    );
    const skills = await prisma.skill.findMany({
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              ...(isValidSkillCategory
                ? [
                    {
                      category: {
                        equals: query.toUpperCase() as SkillCategory,
                      },
                    },
                  ]
                : []),
              {
                location: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return c.json({ skills }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
export async function handleGetBrowseItems(c: Context) {
  const prisma = prismaClient(c);
  try {
    const query = c.req.query("query")?.replace(/^"|"$/g, "").trim();
    const isValidItemCategory = Object.values(ItemCategory).includes(
      query?.toUpperCase() as ItemCategory
    );
    const items = await prisma.item.findMany({
      where: query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              ...(isValidItemCategory
                ? [
                    {
                      category: {
                        equals: query.toUpperCase() as ItemCategory,
                      },
                    },
                  ]
                : []),
              {
                location: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return c.json({ items }, 200);
  } catch (error) {
    return c.json({ msg: "Internal Server Error" }, 500);
  }
}
