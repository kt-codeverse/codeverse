'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * 검색 바의 각 단계별 UI를 표시하는 재사용 가능한 드롭다운 컴포넌트입니다.
 * React Portal을 사용하여 DOM의 최상단(document.body)에 렌더링되므로,
 * 부모 컴포넌트의 스타일에 구애받지 않고 자유롭게 위치할 수 있습니다.
 *
 * @param open - 드롭다운의 열림/닫힘 상태
 * @param onClose - 드롭다운이 닫혀야 할 때 호출되는 함수 (예: 외부 클릭)
 * @param children - 드롭다운 내부에 표시될 컨텐츠
 * @param anchorRef - 드롭다운이 위치할 기준이 되는 요소의 ref
 * @param onPosition - 드롭다운의 위치가 계산된 후 호출되는 함수 (계산된 너비를 인자로 받음)
 * @param preferredWidth - 드롭다운의 선호 너비 (숫자, 'auto', '%', 'px' 등)
 * @param align - 드롭다운의 정렬 방향 ('left', 'center', 'right')
 */
export default function SearchDropdown({
  open,
  onClose,
  children,
  anchorRef,
  onPosition,
  preferredWidth,
  align,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorRef?: React.RefObject<HTMLElement | null>;
  onPosition?: (width: number) => void;
  preferredWidth?: number | string;
  align?: 'left' | 'center' | 'right';
}) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  /**
   * 드롭다운의 위치와 크기를 계산하고 상태를 업데이트합니다.
   * anchorRef를 기준으로 위치를 잡고, 뷰포트 크기를 고려하여 크기를 조절합니다.
   * useLayoutEffect를 사용하여 DOM 변경 후 동기적으로 실행되므로 깜빡임 현상을 방지합니다.
   */
  useLayoutEffect(() => {
    function update() {
      const anchor = anchorRef?.current;
      if (!anchor) return setPos(null);
      const rect = anchor.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // preferredWidth prop을 실제 픽셀 값으로 변환
      let computedPreferred: number | undefined;
      if (typeof preferredWidth === 'number') {
        computedPreferred = preferredWidth;
      } else if (typeof preferredWidth === 'string') {
        const s = preferredWidth.trim();
        if (s === 'auto') {
          computedPreferred = undefined;
        } else if (s.endsWith('%')) {
          const pct = parseFloat(s.slice(0, -1));
          if (!isNaN(pct)) computedPreferred = viewportWidth * (pct / 100);
        } else if (s.endsWith('px')) {
          const px = parseFloat(s.slice(0, -2));
          if (!isNaN(px)) computedPreferred = px;
        } else {
          const n = parseFloat(s);
          if (!isNaN(n)) computedPreferred = n;
        }
      }

      const maxPreferred = computedPreferred ?? Math.max(rect.width * 2, 720);
      // 뷰포트 너비와 최대 선호 너비 중 작은 값을 선택하여 너비 결정
      let width = Math.min(maxPreferred, viewportWidth - 32);
      // 너비가 기준 요소의 너비보다 작아지지 않도록 보장
      width = Math.max(width, rect.width);

      const minLeft = 16;
      const maxRight = viewportWidth - 16;

      // 드롭다운이 화면 밖으로 나가지 않도록 left와 width 값을 조정
      let left = rect.left;
      if (left < minLeft) left = minLeft;

      if (left + width > maxRight) {
        const available = maxRight - left;
        width = Math.max(rect.width, Math.min(width, available));
        left = Math.max(minLeft, Math.min(left, maxRight - width));
      }

      // 최종 위치와 크기를 상태에 저장
      const top = rect.bottom + 8;
      setPos({ left, top, width });
      if (onPosition) onPosition(width);
    }

    if (open) update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, open, onPosition, preferredWidth, align]);

  /**
   * 드롭다운 외부를 클릭하거나 'Escape' 키를 누르면 드롭다운을 닫습니다.
   */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      const portalEl = portalRef.current;
      const anchorEl = anchorRef?.current;
      // 포털 내부나 기준 요소(anchor)를 클릭한 경우는 무시
      if (portalEl && portalEl.contains(e.target as Node)) return;
      if (anchorEl && anchorEl.contains(e.target as Node)) return;
      onClose();
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // createPortal을 사용하여 드롭다운 컨텐츠를 document.body에 직접 렌더링
  const content = (
    <div
      ref={portalRef}
      className="bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{
        position: 'fixed',
        left: pos ? `${pos.left}px` : '50%',
        top: pos ? `${pos.top + 15}px` : '100%',
        width: pos ? `${pos.width}px` : 'auto',
        minWidth: rectWidthFallback(),
        maxWidth: 'calc(100% - 32px)',
        transform: 'translateZ(0) translateY(0)',
        transition:
          'opacity 220ms cubic-bezier(0.2,0.8,0.2,1), transform 320ms cubic-bezier(0.2,0.8,0.2,1)',
        opacity: 1,
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

function rectWidthFallback() {
  try {
    return '200px';
  } catch {
    return '200px';
  }
}
