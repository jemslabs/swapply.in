import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { endpoint } from "@/lib/utils";
import type { useAuthType } from "@/lib/types";

export const useAuth = create<useAuthType>((set) => ({
  user: null,

  login: async (data) => {
    try {
      await axios.post(`${endpoint}/api/auth/login`, data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      }
    }
  },

  fetchUser: async (token) => {
    try {
      const res = await axios.get(`${endpoint}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        set({ user: res.data });
      }
    } catch {
      set({ user: null });
    }
  },

  fetchPublicUser: async (id, token) => {
    try {
      const res = await axios.get(`${endpoint}/api/auth/get-user?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return null;
    }
  },
  getSwapRequests: async (token) => {
    try {
      const res = await axios.get(`${endpoint}/api/auth/swap-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        return res.data || [];
      }
    } catch (error) {
      return [];
    }
  },
}));
