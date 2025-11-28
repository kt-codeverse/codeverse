'use client';

// Firebase SDK 모듈
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // 수정된 경로

// React
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ====================================================================
// 타입 정의
// ====================================================================
interface Space {
  id: string;
  lastMessage?: string;
  timestamp: Timestamp;
}

interface Message {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  createdAt: Timestamp;
}

// ====================================================================
// Chat List Component
// ====================================================================
interface ChatListProps {
  onSelectSpace: (spaceId: string) => void;
  selectedSpaceId: string | null;
  spaces: Space[];
}

function ChatList({ onSelectSpace, selectedSpaceId, spaces }: ChatListProps) {
  return (
    <div
      style={{
        width: '30%',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        background: '#f8f8f8',
      }}
    >
      <h3
        style={{ padding: '15px', margin: 0, borderBottom: '1px solid #ddd' }}
      >
        활성 채팅 공간 ({spaces.length})
      </h3>

      {spaces.map((space) => (
        <div
          key={space.id}
          onClick={() => onSelectSpace(space.id)}
          style={{
            padding: '15px',
            cursor: 'pointer',
            borderBottom: '1px solid #eee',
            background: space.id === selectedSpaceId ? '#e0f7fa' : 'white',
            fontWeight: space.id === selectedSpaceId ? 'bold' : 'normal',
          }}
        >
          <div style={{ fontSize: '14px', color: '#555' }}>
            고객 ID: {space.id.substring(5, 12)}...
          </div>
          <div style={{ fontSize: '16px', marginTop: '5px' }}>
            {space.lastMessage || '새로운 채팅 시작'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ====================================================================
// Chat View Component
// ====================================================================
interface ChatViewProps {
  spaceId: string | null;
}

function ChatView({ spaceId }: ChatViewProps) {
  // spaceId가 있을 때만 메시지를 관리하고, 없으면 빈 배열을 사용합니다.
  const [messages, setMessages] = useState<Message[]>([]);
  // 최종적으로 렌더링할 메시지 목록
  // spaceId가 있으면 state의 messages를, 없으면 빈 배열을 사용합니다.
  const displayedMessages = spaceId ? messages : [];

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spaceId) {
      const q = query(
        collection(db, 'messages', spaceId, 'chats'),
        orderBy('createdAt'),
      );

      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as Message),
          );
          setMessages(data);
        },
        (err) => console.error('메시지 구독 오류:', err),
      );

      return () => unsubscribe();
    }
  }, [spaceId]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !spaceId) return;

      const messageData = {
        sender: 'admin' as const,
        text: input,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages', spaceId, 'chats'), messageData);

      await setDoc(
        doc(db, 'active_chats', spaceId),
        {
          lastMessage: input,
          timestamp: serverTimestamp(),
        },
        { merge: true },
      );

      setInput('');
    },
    [input, spaceId],
  );

  if (!spaceId) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#888',
          textAlign: 'center',
        }}
      >
        <p>왼쪽 목록에서 채팅 공간을 선택하세요.</p>
        <p style={{ fontSize: '0.9em', color: '#aaa' }}>
          활성 채팅 공간이 없으면, 클라이언트(예: 웹사이트)에서 먼저 채팅을
          시작해야 합니다.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '15px',
          borderBottom: '1px solid #ddd',
          background: 'white',
        }}
      >
        <strong>{spaceId.substring(5, 12)}... 고객과의 채팅 공간</strong>
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '15px' }}
      >
        {displayedMessages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: '10px',
              textAlign: m.sender === 'admin' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '15px',
                background: m.sender === 'admin' ? '#1e88e5' : '#f1f1f1',
                color: m.sender === 'admin' ? 'white' : 'black',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        style={{
          display: 'flex',
          padding: '10px',
          borderTop: '1px solid #ddd',
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="관리자 메시지 입력"
        />
        <button
          style={{
            marginLeft: '10px',
            padding: '10px 15px',
            background: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
}

// ====================================================================
// 메인 앱
// ====================================================================
export default function AdminChat() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'active_chats'),
      orderBy('timestamp', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Space));
      setSpaces(list);

      if (
        selectedSpaceId &&
        !list.some((space) => space.id === selectedSpaceId)
      ) {
        setSelectedSpaceId(null);
      } else if (!selectedSpaceId && list.length > 0) {
        setSelectedSpaceId(list[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedSpaceId]); // selectedSpaceId 종속성 추가

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 12rem)' }}>
      <ChatList
        onSelectSpace={setSelectedSpaceId}
        selectedSpaceId={selectedSpaceId}
        spaces={spaces}
      />
      <ChatView spaceId={selectedSpaceId} />
    </div>
  );
}
