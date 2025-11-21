// src/components/review/ReviewsModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { http } from "@/lib/http";
import { mockReviews } from "@/data/mockReviews";
import type { ReviewsResponse, RatingCategory } from "@/types/review";

type ReviewsModalProps = {
  open: boolean;
  onClose: () => void;
  listingId: string;
};

const PAGE_SIZE = 5;

export default function ReviewsModal({
  open,
  onClose,
  listingId,
}: ReviewsModalProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open || !listingId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await http.get<ReviewsResponse>("/reviews", {
          params: { listingId },
        });
        setData(res.data);
      } catch (error) {
        console.error("리뷰 API 실패, 목업 사용:", error);
        const mock = mockReviews[listingId];
        setData(mock ?? null);
      } finally {
        setLoading(false);
        setPage(1);
        setActiveTag("all");
      }
    })();
  }, [open, listingId]);

  const ratingBar = (category: RatingCategory) => {
    const ratio = category.score / 5;
    return (
      <div key={category.key} className="flex items-center justify-between">
        <span className="text-sm">{category.label}</span>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-40 rounded-full bg-neutral-200">
            <div
              className="h-1.5 rounded-full bg-neutral-900"
              style={{ width: `${ratio * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-sm">
            {category.score.toFixed(1)}
          </span>
        </div>
      </div>
    );
  };

  // 🔍 태그 필터 적용
  const filteredReviews = useMemo(() => {
    if (!data) return [];
    if (activeTag === "all") return data.reviews;
    return data.reviews.filter((r) => r.content.includes(activeTag));
  }, [data, activeTag]);

  // 📄 페이지네이션 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / PAGE_SIZE) || 1
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
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

  // ✅ 모든 훅(useState/useEffect/useMemo) 선언 뒤에 early return 배치
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 overflow-y-auto">
      {/* 모달 박스: 위에서 약간 떨어진 위치 + 최대 높이 */}
      <div className="mx-auto my-10 flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl max-h-[calc(100vh-80px)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-neutral-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center text-base font-semibold">
            후기 {data?.totalCount ?? 0}개
          </div>
          <div className="w-6" />
        </div>

        {/* 바디 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽: 평점/통계 */}
          <div className="hidden w-72 flex-shrink-0 flex-col gap-6 border-r px-8 py-6 md:flex">
            <div className="text-center">
              <div className="text-4xl font-semibold">
                {data?.overallRating.toFixed(2) ?? "-"}
              </div>
              <div className="mt-2 text-xs text-neutral-500">게스트 선호</div>
              <div className="mt-1 text-[11px] text-neutral-500">
                평점, 후기, 신뢰도 측면에서 게스트가 선호하는 숙소입니다.
              </div>
            </div>

            <div className="space-y-2">
              {data?.ratingCategories.map(ratingBar)}
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
                            )
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
