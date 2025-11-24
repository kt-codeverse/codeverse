// src/components/review/ReviewsModal.tsx
"use client";

import { useEffect, useMemo, useState, MouseEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { api } from "@/lib/http";
import { mockReviews } from "@/data/mockReviews";
import type { ReviewsResponse, RatingCategory } from "@/types/review";

// 백엔드에서 오는 리뷰 응답 타입 (GET /rooms/:roomId/reviews)
type BackendReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  bookingId: string;
  roomId: string;
  guest: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
};

type ReviewsModalProps = {
  open: boolean;
  onClose: () => void;
  listingId: string; // = roomId
};

const PAGE_SIZE = 5;

// 평균 별점으로 카테고리 바 채우기
const buildRatingCategories = (avg: number): RatingCategory[] => [
  { key: "cleanliness", label: "청결도", score: avg },
  { key: "accuracy", label: "정확도", score: avg },
  { key: "communication", label: "의사소통", score: avg },
  { key: "location", label: "위치", score: avg },
  { key: "value", label: "가격 대비 만족도", score: avg },
];

// 카테고리 한 줄 UI
function renderRatingRow(category: RatingCategory) {
  return (
    <div
      key={category.key}
      className="flex items-center justify-between py-3 text-sm"
    >
      <span className="text-neutral-800">{category.label}</span>
      <span className="font-medium text-neutral-900">
        {category.score.toFixed(1)}
      </span>
    </div>
  );
}

export default function ReviewsModal({
  open,
  onClose,
  listingId,
}: ReviewsModalProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (!open || !listingId) return;

    (async () => {
      setLoading(true);
      try {
        // 실제 리뷰 API 호출: GET /rooms/:roomId/reviews
        const res = await api.get<BackendReview[]>(
          `/rooms/${listingId}/reviews`,
        );
        const apiReviews = res.data;

        // 서버에 리뷰가 하나도 없을 때
        if (!apiReviews.length) {
          const mock = mockReviews[listingId] as ReviewsResponse | undefined;
          if (mock) {
            setData(mock);
          } else {
            setData({
              listingId,
              totalCount: 0,
              overallRating: 0,
              ratingCategories: buildRatingCategories(0),
              tags: [],
              reviews: [],
            });
          }
          return;
        }

        // 백엔드 리뷰 → 프론트 리뷰 형태로 변환
        const mappedReviews: ReviewsResponse["reviews"] = apiReviews.map(
          (r) => ({
            id: r.id,
            rating: r.rating,
            content: r.comment ?? "",
            stayDate: new Date(r.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
            }),
            authorName: r.guest?.name ?? "게스트",
            authorAvatarUrl: r.guest?.avatar ?? "",
            memberSinceYears: 1, // 추후 API 생기면 교체
          }),
        );

        const overallRating =
          mappedReviews.reduce((sum, r) => sum + r.rating, 0) /
          mappedReviews.length;

        const tagsFromMock =
          (mockReviews[listingId] as ReviewsResponse | undefined)?.tags ?? [];

        const composed: ReviewsResponse = {
          listingId,
          totalCount: mappedReviews.length,
          overallRating,
          ratingCategories: buildRatingCategories(overallRating),
          tags: tagsFromMock,
          reviews: mappedReviews,
        };

        setData(composed);
      } catch (error) {
        console.error("리뷰 API 실패, 목업 사용:", error);
        const mock = mockReviews[listingId] as ReviewsResponse | undefined;
        if (mock) {
          setData(mock);
        } else {
          setData({
            listingId,
            totalCount: 0,
            overallRating: 0,
            ratingCategories: buildRatingCategories(0),
            tags: [],
            reviews: [],
          });
        }
      } finally {
        setLoading(false);
        setPage(1);
        setActiveTag("all");
        setAnimateOut(false);
      }
    })();
  }, [open, listingId]);

  // 🔍 태그 필터 적용
  const filteredReviews = useMemo(() => {
    if (!data) return [];
    if (activeTag === "all") return data.reviews;
    return data.reviews.filter((r) => r.content.includes(activeTag));
  }, [data, activeTag]);

  // 📄 페이지네이션 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / PAGE_SIZE) || 1,
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleChangeTag = (tag: string) => {
    setActiveTag(tag);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  // ✨ 닫기 애니메이션 포함한 공통 close 핸들러
  const startClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onClose();
      setAnimateOut(false);
    }, 200); // Tailwind duration-200 과 맞춤
  };

  // 배경 클릭 시 닫기 (모달 박스를 클릭한 경우는 무시)
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      startClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
        animateOut ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleBackdropClick}
    >
      {/* 모달 박스: 최대 높이 지정 + 내부 스크롤 + 등장/퇴장 애니메이션 */}
      <div
        className={`mx-4 my-8 flex w-full max-w-5xl max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-3xl bg-white shadow-xl transform transition-all duration-200 ${
          animateOut
            ? "scale-95 translate-y-2 opacity-0"
            : "scale-100 translate-y-0 opacity-100"
        }`}
      >
        {/* 헤더: X를 오른쪽 상단으로 이동 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="w-6" /> {/* 왼쪽 여백용 */}
          <div className="flex-1 text-center text-base font-semibold">
            후기 {data?.totalCount ?? 0}개
          </div>
          <button
            type="button"
            onClick={startClose}
            className="rounded-full p-1 hover:bg-neutral-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽: 평점/통계 */}
          <div className="hidden w-72 flex-shrink-0 flex-col border-r px-8 py-6 md:flex">
            {/* 전체 평점 박스 */}
            <div className="pb-6 text-center border-b border-neutral-200">
              <div className="text-4xl font-semibold">
                {data?.overallRating.toFixed(2) ?? "-"}
              </div>
              <div className="mt-2 text-xs text-neutral-500">게스트 선호</div>
              <div className="mt-1 text-[11px] leading-relaxed text-neutral-500">
                평점, 후기, 신뢰도 측면에서 게스트가 선호하는 숙소입니다.
              </div>
            </div>

            {/* 카테고리 리스트 */}
            <div className="mt-2 divide-y divide-neutral-200">
              {data?.ratingCategories.map(renderRatingRow)}
            </div>
          </div>

          {/* 오른쪽: 필터 + 리뷰 리스트 + 페이지네이션 */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading && (
              <p className="text-sm text-neutral-500">후기 불러오는 중...</p>
            )}

            {data && !loading && (
              <>
                {/* 검색/필터 영역 */}
                <div className="mb-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-base font-semibold">
                      후기 {filteredReviews.length}개
                    </div>
                    <select className="rounded-full border border-neutral-300 px-3 py-1 text-xs">
                      <option>관련성 높은 순</option>
                      <option>최근 작성 순</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeTag("all")}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        activeTag === "all"
                          ? "bg-black text-white"
                          : "border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                      }`}
                    >
                      모든 후기
                    </button>
                    {data.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleChangeTag(tag)}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          activeTag === tag
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 리뷰 리스트 */}
                {paginatedReviews.length === 0 ? (
                  <p className="mt-6 text-sm text-neutral-500">
                    선택한 태그에 해당하는 후기가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {paginatedReviews.map((review) => (
                      <article
                        key={review.id}
                        className="border-b border-neutral-200 pb-5 last:border-none last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                            {review.authorAvatarUrl && (
                              <Image
                                src={review.authorAvatarUrl}
                                alt={review.authorName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="text-xs">
                            <div className="font-semibold">
                              {review.authorName}
                            </div>
                            <div className="text-neutral-500">
                              에어비앤비 가입 기간 {review.memberSinceYears}년
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-neutral-600">
                          ⭐{" "}
                          {Array.from({ length: review.rating }).map(
                            (_, idx) => (
                              <span key={idx}>★</span>
                            ),
                          )}{" "}
                          · {review.stayDate}
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                          {review.content}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {/* 페이지네이션 */}
                {paginatedReviews.length > 0 && (
                  <div className="mt-6 flex items-center justify-center gap-4 text-xs">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="rounded-full border px-3 py-1 disabled:opacity-40"
                    >
                      이전
                    </button>
                    <span className="text-neutral-600">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="rounded-full border px-3 py-1 disabled:opacity-40"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}

            {!data && !loading && (
              <p className="text-sm text-neutral-500">
                아직 등록된 후기가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
