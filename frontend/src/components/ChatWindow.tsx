// src/components/ChatWindow.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from 'firebase/firestore';

// 타입 정의
interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

// Props 타입 정의
interface ChatWindowProps {
  onClose: () => void;
}

// 역할: 현재 브라우저 세션 동안 고유한 채팅방 ID를 유지 관리합니다.
// 고객이 페이지를 새로고침해도 같은 채팅방을 사용하게 합니다.
function createAndStoreRoomId() {
  const id = `room_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('roomId', id);
  }
  return id;
}

const roomId =
  typeof window !== 'undefined'
    ? sessionStorage.getItem('roomId') || createAndStoreRoomId()
    : 'server_placeholder';

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 실시간 메시지 구독 (Read - onSnapshot)
  useEffect(() => {
    if (roomId === 'server_placeholder') return;

    // Firestore 컬렉션 경로: messages/{roomId}/chats
    const chatCollectionRef = collection(db, 'messages', roomId, 'chats');

    const q = query(chatCollectionRef, orderBy('createdAt'));

    // 실시간 구독 설정
    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = [];
      snap.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    // 클린업 함수: 컴포넌트 언마운트 시 구독 해제
    return () => unsub();
  }, [roomId]);

  // 메시지 수신 시 스크롤 최하단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 2. 메시지 전송 (Write - addDoc)
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || roomId === 'server_placeholder') return;

    const newText = input;
    setInput('');

    // Firestore 컬렉션 경로: messages/{roomId}/chats
    const chatCollectionRef = collection(db, 'messages', roomId, 'chats');

    await addDoc(chatCollectionRef, {
      sender: 'user',
      text: newText,
      createdAt: serverTimestamp(),
    });

    const activeChatRef = doc(db, 'active_chats', roomId);
    await setDoc(
      activeChatRef,
      {
        lastMessage: newText,
        timestamp: serverTimestamp(),
      },
      { merge: true },
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '320px',
        height: '420px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 30px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          padding: 12,
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong style={{ fontSize: '16px' }}>{roomId.substring(5)} 상담</strong>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '18px',
          }}
          aria-label="채팅 닫기"
        >
          &times;
        </button>
      </div>

      <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: 10,
              textAlign: m.sender === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 12,
                background: m.sender === 'user' ? '#2563eb' : '#f1f5f9',
                color: m.sender === 'user' ? '#fff' : '#000',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={sendMessage}
        style={{ display: 'flex', padding: 8, borderTop: '1px solid #eee' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '6px 0 0 6px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 15px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
          }}
          disabled={!input.trim()}
        >
          전송
        </button>
      </form>
    </div>
  );
}
