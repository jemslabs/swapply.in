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
  getBrowseItems: async (data, token) => {
    const { category, query, fromPrice, toPrice, score, condition } = data;
    try {
      const res = await axios.get(
        `${endpoint}/api/item/browse-items?category=${category}&query=${query}&fromPrice=${fromPrice}&toPrice=${toPrice}&score=${score}&condition=${condition}`,
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
  getBrowseCircles: async (data, token) => {
    const { query } = data;
    const res = await axios.get(
      `${endpoint}/api/circle/get-public-circles?query=${query}`,
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
  sendSwapPropsal: async (data, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/item/swap-proposal`, data, {
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
  acceptSwapProposal: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/accept-swap-proposal?id=${id}`,
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
  rejectSwapProposal: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/reject-swap-proposal?id=${id}`,
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
  cancelSwapProposal: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/cancel-swap-proposal?id=${id}`,
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
  createCircle: async (data, navigate, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/circle/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success(res.data.msg);
        navigate(`/circles/${res.data.data.id}`);
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
  fetchMyCircles: async (token) => {
    try {
      const res = await axios.get(`${endpoint}/api/circle/get-my-circles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return [];
    }
  },
  fetchCircle: async (id, token) => {
    try {
      const res = await axios.get(
        `${endpoint}/api/circle/get-circle?circleId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return null;
    }
  },
  joinCircle: async (id, token) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/circle/join?circleId=${id}`,
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
  addItemCircle: async (data, token) => {
    try {
      const res = await axios.post(`${endpoint}/api/circle/add-item`, data, {
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
  leaveCircle: async (id, token) => {
    try {
      const res = await axios.delete(
        `${endpoint}/api/circle/leave?circleId=${id}`,
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
  approveItem: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/circle/approve-item?circleItemId=${id}`,
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
      const res = await axios.get(
        `${endpoint}/api/item/get-swap?swapId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch {
      return null;
    }
  },
  scheduleSwapMeeting: async (data, token) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/item/schedule-swap-meeting`,
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
  cancelSwapMeeting: async (id, token) => {
    try {
      const res = await axios.put(
        `${endpoint}/api/item/cancel-swap-meeting?inpersonId=${id}`,
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
  boostItem: async (id, token) => {
    try {
      const res = await axios.post(
        `${endpoint}/api/item/boost?itemId=${id}`,
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
}));
