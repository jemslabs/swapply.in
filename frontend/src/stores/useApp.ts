import type { useAppType } from "@/lib/types";
import { endpoint } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useApp = create<useAppType>((set) => ({
  addItem: async (data) => {
    try {
      const res = await axios.post(`${endpoint}/api/item/add`, data, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Item Added");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      }
    }
  },
  getBrowseItems: async (data) => {
    const { category, query, fromPrice, toPrice, currencyType } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/item/browse-items?category=${category}&query=${query}&fromPrice=${fromPrice}&toPrice=${toPrice}&currencyType=${currencyType}`,
        {withCredentials: true}
      );
      if (res.status === 200) {
        return res.data;
      } else {
        return []
      }
    } catch {
      return [];
    }
  },
}));
