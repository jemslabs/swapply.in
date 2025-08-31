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
  getBrowseItems: async (data) => {
    const { query } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/browse/items?query=${query}`,
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
  getBrowseSkills: async (data) => {
    const { query } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/browse/skills?query=${query}`,
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

  getBrowseAll: async (data) => {
    const { query } = data;
    try {
      const res = await axios.get(`${endpoint}/api/browse/all?query=${query}`);
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
  acceptSwapRequest: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/swap/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
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
  rejectSwapRequest: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/swap/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
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
  getSwap: async (id, token) => {
    try {
      const res = await axios.get(`${endpoint}/api/swap/${id}`, {
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
  scheduleMeeting: async (data, token) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/swap/schedule-meeting`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

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
  confirmMeeting: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/swap/confirm-meeting/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

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

  completeSwap: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/swap/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

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
  getSkill: async (id, token) => {
    try {
      const res = await axios.get(`${endpoint}/api/skill/get-skill?id=${id}`, {
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
}));
