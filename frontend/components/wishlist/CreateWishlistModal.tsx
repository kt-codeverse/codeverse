"use client";

import { useState, FormEvent } from "react";
import { Wishlist } from "@/types/model";
import { http } from "@/lib/http";

type CreateWishlistModalProps = {
  open: boolean;
  onClose: () => void;
  // 새로 만든 위시리스트를 부모(HeartButton)로 전달
  onCreated: (wishlist: Wishlist) => void;
};

export default function CreateWishlistModal({
  open,
  onClose,
  onCreated,
}: CreateWishlistModalProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const maxLength = 50;

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    try {
      setSubmitting(true);
      // axios로 새 위시리스트 생성
      const res = await http.post<Wishlist>("/wishlists", {
        name: name.trim(),
      });
      onCreated(res.data);
      setName("");
      onClose();
    } catch (error) {
      console.error("위시리스트 생성 실패:", error);
      // TODO: 토스트나 에러 메시지 표시
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-center flex-1">
            위시리스트 만들기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-neutral-500 hover:text-black"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-neutral-600 mb-2">이름</label>
            <div className="rounded-2xl border border-neutral-300 px-4 py-3 focus-within:border-black">
              <input
                type="text"
                value={name}
                maxLength={maxLength}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="위시리스트 이름을 입력하세요"
              />
            </div>
            <div className="mt-1 text-xs text-neutral-500 text-right">
              {name.length}/{maxLength}자
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className={`rounded-2xl px-6 py-2 text-sm font-semibold text-white
                ${
                  !name.trim() || submitting
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-rose-500 hover:bg-rose-600"
                }`}
            >
              새로 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
