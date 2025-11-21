"use client";

import { useEffect, useState } from "react";
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

export default function ReviewsModal({
  open,
  onClose,
  listingId,
}: ReviewsModalProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !listingId) return;

    (async () => {
      setLoading(true);
      try {
        // ✅ 실제 API (나중에 백엔드 붙으면 여기만 맞추면 됨)
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
      }
    })();
  }, [open, listingId]);

  if (!open) return null;

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
          <span className="w-8 text-right text-sm">{category.score.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white">
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

        {/* 내용 */}
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

          {/* 오른쪽: 필터 + 리뷰 리스트 */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading && <p className="text-sm text-neutral-500">후기 불러오는 중...</p>}

            {data && !loading && (
              <>
                {/* 검색 / 필터 영역 */}
                <div className="mb-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-base font-semibold">
                      후기 {data.totalCount}개
                    </div>
                    <select className="rounded-full border border-neutral-300 px-3 py-1 text-xs">
                      <option>관련성 높은 순</option>
                      <option>최근 작성 순</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      모든 후기
                    </button>
                    {data.tags.map((tag) => (
                      <button
                        key={tag}
                        className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-500"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 리뷰 리스트 */}
                <div className="space-y-6">
                  {data.reviews.map((review) => (
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
                          <div className="font-semibold">{review.authorName}</div>
                          <div className="text-neutral-500">
                            에어비앤비 가입 기간 {review.memberSinceYears}년
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-neutral-600">
                        ⭐{" "}
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}{" "}
                        · {review.stayDate}
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                        {review.content}
                      </p>
                    </article>
                  ))}
                </div>
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