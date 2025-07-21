import type { NavigateFunction } from "react-router-dom";

export type user = {
  id: number;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  items: ItemType[];
  skills: SkillType[];
  notifications: notification[];
  clerkId: string;
};

export type loginData = {
  name?: string;
  email: string;
  image: string;
  clerkId: string;
};

export type AddItemType = {
  title: string;
  price: number;
  category: string;
  condition: string;
  hasBill: boolean;
  image: File | null;
  lookingFor: string;
  location: string;
};
export type ItemType = Omit<AddItemType, "image"> & {
  id: number;
  userId: number;
  user: user | null;
  image: string;
  isSwapped: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AddSkillType = {
  title: string;
  image: File | string | null;
  category: string;
  location: string;
  isRemote: boolean;
  lookingFor: string;
  duration: number;
};
export type SkillType = Omit<AddSkillType, "image"> & {
  id: number;
  userId: number;
  user: user | null;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
export type notification = {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  link: string;
  type: string;
  category: "SWAP" | "MEETING" | string;
};

export type sendSwapRequestType = {
  proposerType: "ITEM" | "SKILL";
  receiverType: "ITEM" | "SKILL";
  receiverId: number;
  proposedId: number;
  receivedId: number;
};

export type swapRequestType = {
  id: number;
  proposerId: number;
  receiverId: number;
  proposer: user;
  receiver: user;
  proposerItemId: number;
  proposerItem: ItemType;
  proposerSkillId: number;
  proposerSkill: SkillType;
  proposerType: "ITEM" | "SKILL";
  receiverItemId: number;
  receiverItem: ItemType;
  receiverSkillId: number;
  receiverSkill: SkillType;
  receiverType: "ITEM" | "SKILL";
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
};

type ExtendedItem = ItemType & { type: "item" };
type ExtendedSkill = SkillType & { type: "skill" };
type BrowseResult = ExtendedItem | ExtendedSkill;
export type useAppType = {
  addItem: (
    data: FormData,
    navigate: NavigateFunction,
    token: string | null
  ) => void;
  getBrowseItems: (
    data: {
      query: string;
    },
    token: string | null
  ) => Promise<{ items: ItemType[] } | { items: [] }>;
  getBrowseSkills: (
    data: {
      query: string;
    },
    token: string | null
  ) => Promise<{ skills: SkillType[] } | { skills: [] }>;
  getBrowseAll: (
    data: {
      query: string;
    },
    token: string | null
  ) => Promise<{ results: BrowseResult[] }>;
  getItem: (
    id: string | undefined,
    token: string | null
  ) => Promise<ItemType | null>;
  addSkill: (
    data: FormData,
    navigate: NavigateFunction,
    token: string | null
  ) => void;
  sendSwapRequest: (data: sendSwapRequestType, token: string | null) => void;
  acceptSwapRequest: (id: string | number, token: string | null) => void;
  rejectSwapRequest: (id: string | number, token: string | null) => void;
};
export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: (token: string | null) => void;
  fetchPublicUser: (
    id: number | string | undefined,
    token: string | null
  ) => Promise<user | null>;
  getSwapRequests: (
    token: string | null
  ) => Promise<{
    receivedSwaps: swapRequestType[];
    proposedSwaps: swapRequestType[];
  }>;
};
