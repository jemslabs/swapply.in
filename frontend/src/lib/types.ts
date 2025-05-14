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

export type useAuthType = {
  user: user | null;
  login: (data: loginData) => void;
  fetchUser: () => void;
  logout: () => void;
};
