export type User = {
  id?: string;
  name: string;
  role: string;
  trips: number;
  reviewsCount: number;
  memberFor: string;
  verified: boolean;
  avatar: string;
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