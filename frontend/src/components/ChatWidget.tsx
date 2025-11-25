// src/components/ChatWidget.tsx
'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="open chat"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          fontSize: '24px',
        }}
      >
        💬
      </button>

      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
