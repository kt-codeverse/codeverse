export type RatingCategoryKey =
  | "cleanliness"
  | "accuracy"
  | "checkIn"
  | "communication"
  | "location"
  | "value";

export type RatingCategory = {
  key: RatingCategoryKey;
  label: string;
  score: number; // 0~5
};

export type ReviewTag = string;

export type ReviewItem = {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  memberSinceYears: number; // 가입 기간 (년)
  stayDate: string; 
  rating: number;
  content: string;
};

export type ReviewsResponse = {
  listingId: string;
  overallRating: number;
  totalCount: number;
  ratingCategories: RatingCategory[];
  tags: ReviewTag[];
  reviews: ReviewItem[];
};