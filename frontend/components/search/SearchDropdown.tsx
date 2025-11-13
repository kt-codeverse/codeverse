'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

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

  useLayoutEffect(() => {
    function update() {
      const anchor = anchorRef?.current;
      if (!anchor) return setPos(null);
      const rect = anchor.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

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
      let width = Math.min(maxPreferred, viewportWidth - 32);
      // ensure width is at least anchor width
      width = Math.max(width, rect.width);

      const minLeft = 16;
      const maxRight = viewportWidth - 16;

      let left = rect.left;
      if (left < minLeft) left = minLeft;

      if (left + width > maxRight) {
        const available = maxRight - left;
        width = Math.max(rect.width, Math.min(width, available));
        left = Math.max(minLeft, Math.min(left, maxRight - width));
      }

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      const portalEl = portalRef.current;
      const anchorEl = anchorRef?.current;
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
