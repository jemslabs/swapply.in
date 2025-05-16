import { z } from "zod";

export const authSchema = z.object({
  name: z.string().min(2, "Name too short").optional(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const addItemSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(5, "Description is too short"),
  image: z.any(),
  currentPrice: z
    .string()
    .transform((val) => parseFloat(val))  // Converts the string to number
    .refine((val) => !isNaN(val), {
      message: "Current Price must be a valid number",
    }),
  originalPrice: z
    .string()
    .transform((val) => parseFloat(val))  // Converts the string to number
    .refine((val) => !isNaN(val), {
      message: "Original Price must be a valid number",
    }),
  currencyType: z.string(),
  company: z.string(),
  category: z.string(),
  condition: z.string(),
  barterType: z.string(),
  location: z.string().optional(),
  hasBill: z
    .string()
    .transform((val) => val === "true")  // Converts "true"/"false" string to boolean
    .refine((val) => typeof val === "boolean", {
      message: "Has Bill must be a valid boolean",
    }),
});

export const swapProposalSchema = z.object({
  receiverId: z.preprocess(val => Number(val), z.number()),
  proposedItemId: z.preprocess(val => Number(val), z.number()),
  receiverItemId: z.preprocess(val => Number(val), z.number()),
  message: z.string().optional(),
});
