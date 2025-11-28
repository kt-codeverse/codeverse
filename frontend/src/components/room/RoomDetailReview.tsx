'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/http';
import { mockReviews } from '@/data/mockReviews';
import type { ReviewsResponse, RatingCategory } from '@/types/review';

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

type ReviewsSectionProps = {
  listingId: string;
};

const buildRatingCategories = (avg: number): RatingCategory[] => [
  { key: 'cleanliness', label: '청결도', score: avg },
  { key: 'accuracy', label: '정확도', score: avg },
  { key: 'communication', label: '의사소통', score: avg },
  { key: 'location', label: '위치', score: avg },
  { key: 'value', label: '가격 대비 만족도', score: avg },
];

export default function RoomDetailReview({ listingId }: ReviewsSectionProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [activeTag, setActiveTag] = useState<string>('all');

  // 📌 페이지 로드시 바로 리뷰 불러오기
  useEffect(() => {
    if (!listingId) return;
    console.log('Id : ', listingId);

    (async () => {
      try {
        const res = await api.get<BackendReview[]>(
          `/rooms/${listingId}/reviews`,
        );
        const apiReviews = res.data;
        console.log(apiReviews);

        if (!apiReviews.length) {
          setData(
            mockReviews[listingId] ?? {
              listingId,
              totalCount: 0,
              overallRating: 0,
              ratingCategories: buildRatingCategories(0),
              tags: [],
              reviews: [],
            },
          );
          return;
        }

        const mapped = apiReviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          content: r.comment ?? '',
          stayDate: new Date(r.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
          }),
          authorName: r.guest?.name ?? '게스트',
          authorAvatarUrl: r.guest?.avatar ?? '',
          memberSinceYears: 1,
        }));

        const avg = mapped.reduce((s, r) => s + r.rating, 0) / mapped.length;

        const composed: ReviewsResponse = {
          listingId,
          totalCount: mapped.length,
          overallRating: avg,
          ratingCategories: buildRatingCategories(avg),
          tags:
            (mockReviews[listingId] as ReviewsResponse | undefined)?.tags ?? [],
          reviews: mapped,
        };

        setData(composed);
      } catch (error) {
        console.error('리뷰 API 실패, 목업 사용:', error);
        const fallback = mockReviews[listingId];
        setData(
          fallback ?? {
            listingId,
            totalCount: 0,
            overallRating: 0,
            ratingCategories: buildRatingCategories(0),
            tags: [],
            reviews: [],
          },
        );
      }
    })();
  }, [listingId]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];
    if (activeTag === 'all') return data.reviews;
    return data.reviews.filter((r) => r.content.includes(activeTag));
  }, [data, activeTag]);

  if (!data) return null;

  return (
    <section className="mt-10">
      {/* 🔥 상단: 평점 + 카테고리 가로 정렬 */}
      <div className="flex flex-wrap items-start  border-b pb-6 divide-x items-stretch">
        <div className="text-center pr-6">
          <div className="text-4xl font-semibold">
            {data.overallRating.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-neutral-500">전체 평균 평점</div>
        </div>

        {/* 카테고리 가로 출력 */}
        <div className="flex flex-wrap gap-6 divide-x px-2">
          {data.ratingCategories.map((cat) => (
            <div key={cat.key} className="flex flex-col items-start pr-14 pl-2">
              <span className="text-sm text-neutral-700">{cat.label}</span>
              <span className="font-semibold  ">{cat.score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 태그 */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={`rounded-full px-3 py-1 text-xs ${
            activeTag === 'all'
              ? 'bg-black text-white'
              : 'border border-neutral-300'
          }`}
          onClick={() => setActiveTag('all')}
        >
          모든 후기
        </button>

        {data.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full px-3 py-1 text-xs ${
              activeTag === tag
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 리뷰 리스트 */}
      <div className="mt-8 space-y-6">
        {filteredReviews.length === 0 && (
          <p className="text-sm text-neutral-500">
            선택한 태그에 해당하는 후기가 없습니다.
          </p>
        )}

        {filteredReviews.map((review) => (
          <article key={review.id} className=" border-neutral-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-neutral-300 overflow-hidden">
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
                  에어비앤비 가입 {review.memberSinceYears}년
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-neutral-600">
              ⭐ {Array.from({ length: review.rating }).map(() => '★')} ·{' '}
              {review.stayDate}
            </div>

            <p className="mt-2 text-sm text-neutral-800">{review.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
