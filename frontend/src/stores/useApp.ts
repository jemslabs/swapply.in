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
    const { category, query, fromPrice, toPrice, score, condition } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/item/browse-items?category=${category}&query=${query}&fromPrice=${fromPrice}&toPrice=${toPrice}&score=${score}&condition=${condition}`,
        { withCredentials: true }
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
  getBrowseCircles: async (data) => {
    const {query} = data;
    const res = await axios.get(`${endpoint}/api/circle/get-public-circles?query=${query}`, {
      withCredentials: true
    });
    if(res.status === 200) {
      return res.data;
    } else{
      return []
    }
  },
  getMyItems: async () => {
    try {
      const res = await axios.get(`${endpoint}/api/item/my-items`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return [];
    }
  },
  getItem: async (id) => {
    try {
      const res = await axios.get(`${endpoint}/api/item/get-item?id=${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return null;
    }
  },
  sendSwapPropsal: async (data) => {
    try {
      const res = await axios.post(`${endpoint}/api/item/swap-proposal`, data, {
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
  acceptSwapProposal: async (id) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/accept-swap-proposal?id=${id}`,
        {},
        {
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
  rejectSwapProposal: async (id) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/reject-swap-proposal?id=${id}`,
        {},
        {
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
  cancelSwapProposal: async (id) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/cancel-swap-proposal?id=${id}`,
        {},
        {
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
  createCircle: async (data) => {
    try {
      const res = await axios.post(`${endpoint}/api/circle/create`, data, {
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
  fetchMyCircles: async () => {
    try {
      const res = await axios.get(`${endpoint}/api/circle/get-my-circles`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      return [];
    }
  },
  fetchCircle: async (id) => {
    try {
      const res = await axios.get(
        `${endpoint}/api/circle/get-circle?circleId=${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },
  joinCircle: async (id) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/circle/join?circleId=${id}`,
        {},
        {
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
  addItemCircle: async (data) => {
    try {
      const res = await axios.post(`${endpoint}/api/circle/add-item`, data, {
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
  leaveCircle: async (id) => {
    try {
      const res = await axios.delete(
        `${endpoint}/api/circle/leave?circleId=${id}`,
        {
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
  approveItem: async (id) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/circle/approve-item?circleItemId=${id}`,
        {},
        {
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
  getSwap: async (id) => {
    try {
      const res = await axios.get(
        `${endpoint}/api/item/get-swap?swapId=${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },
  scheduleSwapMeeting: async (data) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/item/schedule-swap-meeting`,
        data,
        {
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
  cancelSwapMeeting: async (id) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/cancel-swap-meeting?inpersonId=${id}`,
        {},
        {
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
  boostItem: async (id) => {
    try {
      const res = await axios.post(`${endpoint}/api/item/boost?itemId=${id}`,{}, {
        withCredentials: true
      });
      if(res.status === 200) {
        toast.success(res.data.msg)
      }
    } catch (error) {
       if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.msg ||
          "Something went wrong. Please try again.";
        toast.error(errorMsg);
      }
    }
  }
}));
