"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { http } from "@/lib/http";
import { mockBooking } from "@/data/mockBooking";
import type { Booking } from "@/types/booking";

type PaymentOption = "full" | "split";

export default function BookingPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("full");
  const [submitting, setSubmitting] = useState(false);

  // 1) 예약 정보 불러오기 (실제 API + 목업 fallback)
  useEffect(() => {
    (async () => {
      try {
        // TODO: 추후 쿼리스트링/파라미터로 bookingId, listingId 받게 수정 가능
        const res = await http.get<Booking>("/bookings/preview", {
          params: { listingId: mockBooking.listing.id },
        });
        setBooking(res.data);
      } catch (error) {
        console.error("예약 프리뷰 불러오기 실패, 목업 사용:", error);
        setBooking(mockBooking);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!booking || submitting) return;

    try {
      setSubmitting(true);

      await http.post("/bookings", {
        listingId: booking.listing.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guestInfo,
        paymentOption,
      });

      // TODO: 결제 완료 페이지 혹은 예약 완료 페이지로 라우팅
      alert("예약 요청이 전송되었습니다. (실제 환경에서는 완료 페이지로 이동)");
    } catch (error) {
      console.error("예약 요청 실패:", error);
      alert("예약 요청 중 문제가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !booking) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-10 w-32 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </main>
    );
  }

  const { listing, priceDetail, guestInfo } = booking;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDateRange = (checkIn: string, checkOut: string) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const formatter = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${formatter.format(inDate)} ~ ${formatter.format(outDate)}`;
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 상단 헤더 */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-rose-500">TripNest</div>
          <div className="text-sm text-neutral-600">예약 요청</div>
        </div>
      </header>

      {/* 본문 */}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        {/* 왼쪽: 예약 단계 */}
        <section className="flex-1 space-y-4">
          {/* 카드 1: 결제 시기 선택 */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold">1. 결제 시기 선택</div>

            <div className="space-y-3">
              {/* 지금 전액 결제 */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 hover:border-neutral-500">
                <input
                  type="radio"
                  name="paymentOption"
                  value="full"
                  checked={paymentOption === "full"}
                  onChange={() => setPaymentOption("full")}
                  className="mt-1 h-4 w-4 cursor-pointer"
                />
                <div>
                  <div className="text-sm font-medium">
                    지금 {formatCurrency(priceDetail.total)} 결제
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    전체 금액을 한 번에 결제합니다.
                  </p>
                </div>
              </label>

              {/* 일부 결제 (목업용 설명) */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 hover:border-neutral-500">
                <input
                  type="radio"
                  name="paymentOption"
                  value="split"
                  checked={paymentOption === "split"}
                  onChange={() => setPaymentOption("split")}
                  className="mt-1 h-4 w-4 cursor-pointer"
                />
                <div>
                  <div className="text-sm font-medium">
                    요금 일부는 지금 결제, 나머지는 나중에 결제
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    지금 {formatCurrency(Math.round(priceDetail.total * 0.45))}을
                    결제하고, 나중에 나머지 금액이 청구됩니다. 추가 수수료는
                    없습니다.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-black"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "요청 중..." : "다음"}
              </button>
            </div>
          </div>

          {/* 카드 2: 결제 수단 추가 (목업용, 접힌 상태) */}
          <div className="rounded-3xl bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">2. 결제 수단 추가</div>
              <span className="text-sm text-neutral-400">나중에 구현 예정</span>
            </div>
          </div>

          {/* 카드 3: 요청 내용 확인 (목업용, 접힌 상태) */}
          <div className="rounded-3xl bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">3. 요청 내용 확인</div>
              <span className="text-sm text-neutral-400">나중에 구현 예정</span>
            </div>
          </div>
        </section>

        {/* 오른쪽: 숙소 요약 */}
        <aside className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg lg:w-96">
          {/* 상단 숙소 정보 */}
          <div className="mb-4 flex gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-sm">
              <div className="text-xs font-semibold text-neutral-500">
                {listing.isGuestFavorite && "게스트 선호 · "}
                {listing.locationSummary}
              </div>
              <div className="mt-1 line-clamp-2 text-sm font-semibold">
                {listing.title}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {listing.subtitle}
              </div>
              <div className="mt-2 text-xs text-neutral-700">
                ⭐ {listing.rating}{" "}
                <span className="text-neutral-500">
                  (후기 {listing.reviewCount}개)
                </span>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* 취소 정책 요약 */}
          <div className="mb-4 text-xs text-neutral-700">
            <div className="font-semibold">취소 수수료 없음</div>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
              예약 후 24시간 이내에 취소하면 요금 전액이 환불됩니다. 이후에는
              호스트의 환불 정책이 적용됩니다.
            </p>
          </div>

          <hr className="my-4" />

          {/* 날짜 */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div>
              <div className="font-semibold">날짜</div>
              <div className="text-xs text-neutral-600">
                {formatDateRange(booking.checkIn, booking.checkOut)}
              </div>
            </div>
            <button className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-neutral-50">
              변경
            </button>
          </div>

          {/* 게스트 */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div>
              <div className="font-semibold">게스트</div>
              <div className="text-xs text-neutral-600">
                성인 {guestInfo.adults}명
              </div>
            </div>
            <button className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-neutral-50">
              변경
            </button>
          </div>

          <hr className="my-4" />

          {/* 가격 요약 */}
          <div className="space-y-2 text-sm">
            <div className="font-semibold">요금 세부 정보</div>

            <div className="flex justify-between text-xs text-neutral-700">
              <span>
                {priceDetail.nights}박 × {formatCurrency(priceDetail.pricePerNight)}
              </span>
              <span>{formatCurrency(priceDetail.pricePerNight * priceDetail.nights)}</span>
            </div>

            {priceDetail.cleaningFee > 0 && (
              <div className="flex justify-between text-xs text-neutral-700">
                <span>청소 비용</span>
                <span>{formatCurrency(priceDetail.cleaningFee)}</span>
              </div>
            )}

            {priceDetail.serviceFee > 0 && (
              <div className="flex justify-between text-xs text-neutral-700">
                <span>서비스 수수료</span>
                <span>{formatCurrency(priceDetail.serviceFee)}</span>
              </div>
            )}

            <hr className="my-2" />

            <div className="flex justify-between text-sm font-semibold">
              <span>총액 KRW</span>
              <span>{formatCurrency(priceDetail.total)}</span>
            </div>
          </div>

          <button className="mt-3 w-full text-left text-xs font-medium text-neutral-700 underline">
            요금 상세 내역
          </button>

          {/* 하단 문구 */}
          <div className="mt-6 flex gap-3 text-xs text-neutral-500">
            <span>💎</span>
            <p>
              흔치 않은 기회입니다. 이 숙소는 보통 예약이 가득 차 있습니다.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}