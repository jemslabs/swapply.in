import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

import { endpoint } from "@/lib/utils";
import type { useAuthType } from "@/lib/types";

export const useAuth = create<useAuthType>((set) => ({
  user: null,
  login: async (data) => {
    try {
      const res = await axios.post(`${endpoint}/api/auth/login`, data, {
        withCredentials: true,
      });
      if (res.status === 200) {
        set({ user: res.data });
        toast.success("Authenticated");
      }
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {

        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      }
    }
  },
}));
