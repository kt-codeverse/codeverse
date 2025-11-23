import type { ReviewsResponse } from "@/types/review";

export const mockReviews: Record<string, ReviewsResponse> = {
  "haeundae-111": {
    listingId: "haeundae-111",
    overallRating: 4.88,
    totalCount: 139,
    ratingCategories: [
      { key: "cleanliness", label: "청결도", score: 4.9 },
      { key: "accuracy", label: "정확도", score: 4.9 },
      { key: "checkIn", label: "체크인", score: 4.9 },
      { key: "communication", label: "의사소통", score: 4.9 },
      { key: "location", label: "위치", score: 4.7 },
      { key: "value", label: "가격 대비 만족도", score: 4.9 },
    ],
    tags: [
      "편리한 대중교통",
      "역 근처",
      "깨끗한 숙소",
      "신속한 응답",
      "아늑한 분위기",
      "조용한 주변 환경",
    ],
    reviews: [
      {
        id: "r1",
        authorName: "학목",
        authorAvatarUrl:
          "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80",
        memberSinceYears: 3,
        stayDate: "2025년 10월",
        rating: 5,
        content:
          "오아시스 공연을 보고 새벽 첫기차로 이동해야 하는 상황에 서울역 인근 숙소로 좋은 선택이었습니다. 감사합니다.",
      },
      {
        id: "r2",
        authorName: "성일",
        authorAvatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        memberSinceYears: 2,
        stayDate: "2025년 10월",
        rating: 5,
        content:
          "정말 편하게 잘 자고 갔습니다. 다음에 서울역 근처에 숙소가 필요하면 다시 방문할 것 같아요.",
      },
      {
        id: "r3",
        authorName: "정아",
        authorAvatarUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
        memberSinceYears: 5,
        stayDate: "2025년 9월",
        rating: 5,
        content:
          "호스트분이 너무 친절하시고 위치도 좋아요. 방도 사진이랑 동일해서 만족했습니다!",
      },
    ],
  },
  // 다른 listingId 필요하면 여기 추가
};