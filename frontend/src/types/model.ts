export type User = {
  id?: string;
  name: string;
  role: string;
  trips: number;
  reviews: number;
  memberFor: string;
  verified: boolean;
};

export type Review = {
  id: string;
  author: string;
  date: string;
  content: string;
};

export type Wishlist = {
  id: string;
  name: string;
  coverImages: string[]; 
  updatedAt: string;     
  itemCount: number;
};