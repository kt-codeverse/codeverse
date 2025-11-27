// src/app/booking/[listingId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { mockBookings } from "@/data/mockBooking";
import type { Booking } from "@/types/booking";
import { useBookingStore } from "@/store/bookingStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export default function BookingPage() {
  // ✅ Next 15에서는 useParams()로 받아야 함
  const params = useParams();
  const listingId = (params?.listingId ?? "") as string;

  const {
    booking,
    setBooking,
    paymentOption,
    setPaymentOption,
    paymentMethod,
    setPaymentMethod,
    guestInfo,
    updateGuestInfo,
    noteToHost,
    setNoteToHost,
  } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 예약 프리뷰 가져오기 (fetch + mock fallback)
  useEffect(() => {
    if (!listingId) return;

    (async () => {
      try {
        const url = `${API_BASE_URL}/bookings/preview?listingId=${encodeURIComponent(
          listingId
        )}`;

        const res = await fetch(url, {
          credentials: "include",
        });

        if (res.ok) {
          const data: Booking = await res.json();
          setBooking(data);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (error) {
        console.error("예약 프리뷰 실패, 목업 사용:", error);
        const mock = mockBookings[listingId];

        if (mock) {
          setBooking(mock);
        } else {
          console.error(
            `mockBookings 에 '${listingId}' 키가 없습니다. mockBooking.ts 확인 필요`
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId, setBooking]);

  // ✅ 예약 요청 보내기 (지금은 fetch만 있고, 서버 없으면 그냥 실패/alert)
  const handleSubmit = async () => {
    if (!booking || submitting) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          listingId: booking.listing.id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: guestInfo,
          paymentOption,
          paymentMethod,
          noteToHost,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      alert("예약 요청이 전송되었습니다. (나중에 완료 페이지로 이동하면 됨)");
    } catch (error) {
      console.error("예약 요청 실패:", error);
      alert("예약 요청 중 문제가 발생했습니다. 백엔드 준비 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const priceDetail = booking?.priceDetail;
  const listing = booking?.listing;

  const guestSummary = useMemo(() => {
    const parts: string[] = [];
    if (guestInfo.adults) parts.push(`성인 ${guestInfo.adults}명`);
    if (guestInfo.children) parts.push(`어린이 ${guestInfo.children}명`);
    if (guestInfo.infants) parts.push(`유아 ${guestInfo.infants}명`);
    return parts.join(", ") || "게스트 없음";
  }, [guestInfo]);

  if (loading || !booking || !priceDetail || !listing) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-10 w-32 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 상단 TripNest 헤더 */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-rose-500">TripNest</div>
          <div className="text-sm text-neutral-600">예약 요청</div>
        </div>
      </header>

      {/* 본문 */}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        {/* 왼쪽: 단계별 예약 영역 */}
        <section className="flex-1 space-y-4">
          {/* 1. 결제 시기 선택 */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold">1. 결제 시기 선택</div>

            <div className="space-y-3">
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
                    결제하고, 나중에 나머지 금액이 청구됩니다.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. 결제 수단 추가 */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold">2. 결제 수단 추가</div>

            {/* 결제 수단 선택 */}
            <div className="mb-4 space-y-2 text-sm">
              <div className="mb-1 text-xs font-semibold text-neutral-600">
                결제 수단
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "card", label: "신용/체크카드" },
                  { value: "kakaopay", label: "카카오페이" },
                  { value: "naverpay", label: "네이버페이" },
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(m.value as typeof paymentMethod)
                    }
                    className={`rounded-full border px-3 py-1 text-xs ${
                      paymentMethod === m.value
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 카드 정보 입력 (카드 선택 시에만 표시) */}
            {paymentMethod === "card" && (
              <div className="space-y-3 text-sm">
                <div>
                  <div className="mb-1 text-xs font-semibold text-neutral-600">
                    카드 소유자 이름
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    placeholder="여권 또는 신분증의 영문 이름"
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-neutral-600">
                    카드 번호
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="mb-1 text-xs font-semibold text-neutral-600">
                      유효기간 (MM/YY)
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      placeholder="12/27"
                    />
                  </div>
                  <div className="w-24">
                    <div className="mb-1 text-xs font-semibold text-neutral-600">
                      CVC
                    </div>
                    <input
                      type="password"
                      maxLength={3}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. 요청 내용 확인 (게스트 + 메모) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-semibold">3. 요청 내용 확인</div>

            {/* 게스트 수 조정 */}
            <div className="mb-6 space-y-3 text-sm">
              <div className="text-xs font-semibold text-neutral-600">
                게스트 수
              </div>

              {[
                { key: "adults", label: "성인", desc: "만 13세 이상" },
                { key: "children", label: "어린이", desc: "만 2~12세" },
                { key: "infants", label: "유아", desc: "만 2세 미만" },
              ].map((row) => {
                const value = guestInfo[row.key as keyof typeof guestInfo] as number;

                return (
                  <div
                    key={row.key}
                    className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-none last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{row.label}</div>
                      <div className="text-xs text-neutral-500">{row.desc}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateGuestInfo({
                            [row.key]: Math.max(
                              0,
                              value - 1
                            ),
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none text-neutral-600 disabled:border-neutral-200 disabled:text-neutral-300"
                        disabled={row.key === "adults" ? value <= 1 : value <= 0}
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm">{value}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateGuestInfo({
                            [row.key]: value + 1,
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none text-neutral-700 hover:border-neutral-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 호스트에게 메모 */}
            <div className="space-y-2 text-sm">
              <div className="text-xs font-semibold text-neutral-600">
                호스트에게 메모
              </div>
              <textarea
                value={noteToHost}
                onChange={(e) => setNoteToHost(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                placeholder="호스트에게 전하고 싶은 요청사항이 있다면 적어주세요."
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-black disabled:bg-neutral-400"
              >
                {submitting ? "요청 보내는 중..." : "예약 요청 보내기"}
              </button>
            </div>
          </div>
        </section>

        {/* 오른쪽: 숙소 요약 */}
        <aside className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg lg:w-96">
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
              <div className="text-xs text-neutral-600">{guestSummary}</div>
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
                {priceDetail.nights}박 ×{" "}
                {formatCurrency(priceDetail.pricePerNight)}
              </span>
              <span>
                {formatCurrency(
                  priceDetail.pricePerNight * priceDetail.nights
                )}
              </span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-sm font-semibold">
              <span>총액 KRW</span>
              <span>{formatCurrency(priceDetail.total)}</span>
            </div>
          </div>

          <button className="mt-3 w-full text-left text-xs font-medium text-neutral-700 underline">
            요금 상세 내역
          </button>

          <div className="mt-6 flex gap-3 text-xs text-neutral-500">
            <span>💎</span>
            <p>흔치 않은 기회입니다. 이 숙소는 보통 예약이 가득 차 있습니다.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}