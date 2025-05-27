type user = {
  id: number;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  items: ItemType[];
  proposedSwaps: proposalType[];
  receivedSwaps: proposalType[];
  circles: memberType[];
};

type loginData = {
  name?: string;
  email: string;
  password: string;
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
};
export type useAppType = {
  addItem: (data: FormData) => void;
  getBrowseItems: (data: {
    category: string;
    query: string;
    fromPrice: string | number;
    toPrice: string | number;
    currencyType: string;
  }) => Promise<{ items: ItemType[] } | { items: [] }>;

  getMyItems: () => Promise<ItemType[] | []>;
  getItem: (id: string | undefined) => Promise<ItemType | null>;
  sendSwapPropsal: (data: SendPropsalType) => void;
  acceptSwapProposal: (id: string | number) => void;
  rejectSwapProposal: (id: string | number) => void;
  cancelSwapProposal: (id: string | number) => void;
  createCircle: (data: FormData) => void;
  fetchMyCircles: () => Promise<memberType[] | []>;
  fetchCircle: (id: string | undefined) => Promise<circleType | null>;
  joinCircle: (id: string | number | undefined) => void;
  addItemCircle: (data: {
    itemId: string | number | undefined;
    circleId: string | number | undefined;
  }) => void;
  leaveCircle: (id: string | number | undefined) => void;
  approveItem: (id: string | number | undefined) => void;
  getSwap: (id: string | number | undefined) => Promise<proposalType | null>;
  scheduleSwapMeeting: (data: AddSwapInpersonType) => void;
};
export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: () => void;
  logout: () => void;
};
