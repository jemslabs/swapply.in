import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isProduction = false;

export const endpoint = isProduction ? "" : "http://localhost:8787";

export const categories = [
  { name: "Electronics", value: "ELECTRONICS" },
  { name: "Clothing", value: "CLOTHING" },
  { name: "Books", value: "BOOKS" },
  { name: "Furniture", value: "FURNITURE" },
  { name: "Toys", value: "TOYS" },
  { name: "Footwear", value: "FOOTWEAR" },
  { name: "Beauty", value: "BEAUTY" },
  { name: "Stationery", value: "STATIONERY" },
  { name: "Other", value: "OTHER" },
];

export const conditions = [
  {
    name: "New",
    value: "NEW",
  },
  {
    name: "Like New",
    value: "LIKE_NEW",
  },
  {
    name: "Used",
    value: "USED",
  },
  {
    name: "Damaged",
    value: "DAMAGED",
  },
];
export function ISTtoUTC({ time, date }: { time: string; date: Date }) {
  const [timeHourStr, timeMinStr, ampm] =
    time.match(/(\d+):(\d+)\s?(AM|PM)/i)?.slice(1) || [];
  let hour = parseInt(timeHourStr);
  const minute = parseInt(timeMinStr);

  if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

  const localDateTime = new Date(date);
  localDateTime.setHours(hour, minute, 0, 0);
 
  const utcDateString = localDateTime.toISOString();
  return utcDateString;
}
