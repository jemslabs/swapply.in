import type { useAppType } from "@/lib/types";
import { endpoint } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useApp = create<useAppType>(() => ({
  addItem: async (data, navigate, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/item/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Item Added");
        navigate(`/item/${res.data.data.id}`);
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
  getItem: async (id, token) => {
    try {
      const res = await axios.get(`${endpoint}/api/item/get-item?id=${id}`, {
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
  addSkill: async (data, navigate, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/skill/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Skill Added");
        navigate(`/skill/${res.data.data.id}`);
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
  getBrowseItems: async (data, token) => {
    const { query } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/browse/items?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  },
  getBrowseSkills: async (data, token) => {
    const { query } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/browse/skills?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  },

  getBrowseAll: async (data, token) => {
    const { query } = data;
    try {
      const res = await axios.get(`${endpoint}/api/browse/all?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  },
  sendSwapRequest: async (data, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/swap`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
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
  acceptSwapRequest: async(id, token) => {
    try {
      const res = await axios.put(`${endpoint}/api/swap/accept/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
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
  rejectSwapRequest: async(id, token) => {
    try {
      const res = await axios.put(`${endpoint}/api/swap/reject/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
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
  
}));
