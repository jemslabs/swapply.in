import type { NavigateFunction } from "react-router-dom";

export type user = {
  id: number;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  items: ItemType[];
  proposedSwaps: proposalType[];
  receivedSwaps: proposalType[];
  circles: memberType[];
  notifications: notification[];
  plan?: ProPlanType;
  clerkId: string;
};

export type loginData = {
  name?: string;
  email: string;
  image: string;
  clerkId: string;
};

export type AddItem = {
  title: string;
  description: string;
  currentPrice: number;
  originalPrice: number;
  currencyType: string;
  company: string;
  category: string;
  condition: string;
  hasBill: boolean;
  image: File | null;
  itemAge: number;
};
export type ItemType = {
  id: number;
  userId: number;
  user: user | null;
  title: string;
  description: string;
  currentPrice: number;
  originalPrice: number;
  currencyType: string;
  company: string;
  category: string;
  condition: string;
  hasBill: boolean;
  image: string | undefined;
  createdAt: Date;
  rating: number;
  isSwapped: boolean;
  itemAge: number;
  score: number;
  boostedItem: boostedItemType;
};
export type boostedItemType = {
  id: number;
  itemId: number;
  userId: number;
  boostedAt: Date;
  expiresAt: Date;
};

export type SendPropsalType = {
  receiverId: string | number | undefined;
  proposedItemId: string | number | undefined;
  receiverItemId: string | number | undefined;
  message: string;
};

export type proposalType = {
  id: number;
  receiver: user;
  proposer: user;
  proposedItem: ItemType;
  receiverItem: ItemType;
  status: string;
  swapInperson: swapInpersonType;
} & SendPropsalType;

export type swapInpersonType = {
  id: number;
  meetingStatus: string;
} & AddSwapInpersonType;

export type AddSwapInpersonType = {
  swapProposalId: number;
  meetingLocation: string;
  date: string;
  time: string;

  notes: string;
};

export type memberType = {
  id: number;
  userId: number;
  user: user;
  circleId: number;
  circle: circleType;
  role: string;
};

export type circleItemType = {
  id: number;
  itemId: number;
  item: ItemType;
  circleId: number;
  userId: number;
  user: user;
  isApproved: boolean;
};
export type circleType = {
  id: number;
  name: string;
  description: string;
  image: string;
  items: circleItemType[];
  members: memberType[];
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
};

export type notification = {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  link: string;
  type: string;
  category: "SWAP" | "MEETING" | "CIRCLE" | string;
};
export type ProPlanType = {
  id: number;
  userId: number;
  startedAt: Date;
  expiresAt: Date;
};
export type useAppType = {
  addItem: (
    data: FormData,
    navigate: NavigateFunction,
    token: string | null
  ) => void;
  getBrowseItems: (
    data: {
      category: string;
      query: string;
      fromPrice: string | number;
      toPrice: string | number;
      condition: string;
      score: number;
    },
    token: string | null
  ) => Promise<{ items: ItemType[] } | { items: [] }>;
  getBrowseCircles: (
    data: { query: string },
    token: string | null
  ) => Promise<circleType[]>;
  getItem: (
    id: string | undefined,
    token: string | null
  ) => Promise<ItemType | null>;
  sendSwapPropsal: (data: SendPropsalType, token: string | null) => void;
  acceptSwapProposal: (id: string | number, token: string | null) => void;
  rejectSwapProposal: (id: string | number, token: string | null) => void;
  cancelSwapProposal: (id: string | number, token: string | null) => void;
  createCircle: (
    data: FormData,
    navigate: NavigateFunction,
    token: string | null
  ) => void;
  fetchMyCircles: (token: string | null) => Promise<memberType[] | []>;
  fetchCircle: (
    id: string | undefined,
    token: string | null
  ) => Promise<circleType | null>;
  joinCircle: (id: string | number | undefined, token: string | null) => void;
  addItemCircle: (
    data: {
      itemId: string | number | undefined;
      circleId: string | number | undefined;
    },
    token: string | null
  ) => void;
  leaveCircle: (id: string | number | undefined, token: string | null) => void;
  approveItem: (id: string | number | undefined, token: string | null) => void;
  getSwap: (
    id: string | number | undefined,
    token: string | null
  ) => Promise<proposalType | null>;

  scheduleSwapMeeting: (
    data: AddSwapInpersonType,
    token: string | null
  ) => void;
  cancelSwapMeeting: (
    id: string | number | undefined,
    token: string | null
  ) => void;
  boostItem: (id: number, token: string | null) => void;
};
export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: (token: string | null) => void;
  fetchPublicUser: (
    id: number | string | undefined,
    token: string | null
  ) => Promise<user | null>;
};
