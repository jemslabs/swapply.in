type user = {
  id: number;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date
  rating: number
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
};
export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: () => void;
  logout: () => void;
};
