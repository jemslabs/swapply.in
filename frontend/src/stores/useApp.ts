import { endpoint } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useApp = create<any>((set) => ({
  addItem: async (data: any) => {
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
}));
