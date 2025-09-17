import { z } from "zod";

export const authSchema = z.object({
  name: z.string().min(2, "Name too short").optional(),
  email: z.string().email(),
  image: z.string(),
  clerkId: z.string(),
});
export const addItemSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  image: z.any(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  category: z.string(),
  condition: z.string(),
  hasBill: z
    .string()
    .transform((val) => val === "true")
    .refine((val) => typeof val === "boolean", {
      message: "Has Bill must be a valid boolean",
    }),
  lookingFor: z.string(),
  location: z.string(),
});

export const addSkillSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  image: z.any(),
  category: z.string(),
  location: z.string().optional(),
  isRemote: z
    .string()
    .transform((val) => val === "true")
    .refine((val) => typeof val === "boolean", {
      message: "isRemote must be a valid boolean",
    }),
  lookingFor: z.string(),
  duration: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "Duration must be a valid number",
    }),
});

export const swapSchema = z.object({
  proposerType: z.enum(["ITEM", "SKILL"]),
  receiverType: z.enum(["ITEM", "SKILL"]),
  receiverId: z.number(),
  proposedId: z.number(),
  receivedId: z.number(),
});

export const addPhoneNumberSchema = z.object({
  number: z.string(),
  swapRequestId: z.number()
})
export const verifyCodeSchema = z.object({
  code: z.string(),
  swapProcessId: z.number()
})