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
  barterType: string;
  location: string;
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
  barterType: string;
  location: string;
  hasBill: boolean;
  image: string | undefined;
  createdAt: Date;
  rating: number;
};

export type SendPropsalType = {
  receiverId: string | number | undefined;
  proposedItemId: string | number | undefined;
  receiverItemId: string | number | undefined;
  message: string;
};

export type proposalType = {
  id: number
  receiver: user;
  proposer: user;
  proposedItem: ItemType;
  receiverItem: ItemType;
  status: string
} & SendPropsalType;


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
};
export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: () => void;
  logout: () => void;
};
