import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isProduction = false

export const endpoint = isProduction ? "" : "http://localhost:8787"



export const categories = [
  { name: "Electronics", value: "ELECTRONICS" },
  { name: "Clothing", value: "CLOTHING" },
  { name: "Books", value: "BOOKS" },
  { name: "Furniture", value:"FURNITURE" },
  { name: "Toys", value: "TOYS" },
  { name: "Footwear", value: "FOOTWEAR" },
  { name: "Beauty", value: "BEAUTY" },
  { name: "Stationery", value:"STATIONERY" },
  { name: "Other", value: "OTHER" },
]

export const conditions = [
  {
    name: "New",
    value: "NEW"
  },
  {
    name: "Like New",
    value: "LIKE_NEW"
  },
  {
    name: "Used",
    value: "USED"
  },
  {
    name: "Damaged",
    value: "DAMAGED"
  },
]
