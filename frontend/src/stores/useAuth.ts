import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { endpoint } from "@/lib/utils";
import type { useAuthType } from "@/lib/types";

export const useAuth = create<useAuthType>((set) => ({
  user: null,
  login: async (data, navigate) => {
    try {
      const res = await axios.post(`${endpoint}/api/auth/login`, data, {
        withCredentials: true,
      });
      if (res.status === 200) {
        await useAuth.getState().fetchUser();
        toast.success("Authenticated");
        navigate("/browse/items");
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
  fetchUser: async () => {
    try {
      const res = await axios.get(`${endpoint}/api/auth/user`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        set({ user: res.data });
      }
    } catch {
      set({ user: null });
    }
  },
  logout: async () => {
    try {
      const res = await axios.post(
        `${endpoint}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        set({ user: null });
        toast.success(res.data.msg);
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
  fetchPublicUser: async (id) => {
    try {
      const res = await axios.get(`${endpoint}/api/auth/get-user?id=${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return null;
    }
  },
}));
