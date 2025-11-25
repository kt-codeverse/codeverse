// Firebase SDK 모듈
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  initializeFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} = require("firebase/firestore");

// React
const React = require("react");
const ReactDOM = require("react-dom/client");
const { useState, useEffect, useRef, useCallback } = React;

// ======================
// Firebase 설정
// ======================
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Firebase 시작
const firebaseApp = initializeApp(firebaseConfig);

// Electron WebView 오류 해결 — Firestore는 반드시 LongPolling 요구
initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

const db = getFirestore(firebaseApp);

// ====================================================================
// Chat List Component
// ====================================================================
function ChatList({ onSelectSpace, selectedSpaceId, spaces }) {
  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        background: "#f8f8f8",
      }}
    >
      <h3
        style={{ padding: "15px", margin: 0, borderBottom: "1px solid #ddd" }}
      >
        활성 채팅 공간 ({spaces.length})
      </h3>

      {spaces.map((space) => (
        <div
          key={space.id}
          onClick={() => onSelectSpace(space.id)}
          style={{
            padding: "15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
            background: space.id === selectedSpaceId ? "#e0f7fa" : "white",
            fontWeight: space.id === selectedSpaceId ? "bold" : "normal",
          }}
        >
          <div style={{ fontSize: "14px", color: "#555" }}>
            고객 ID: {space.id.substring(5, 12)}...
          </div>
          <div style={{ fontSize: "16px", marginTop: "5px" }}>
            {space.lastMessage || "새로운 채팅 시작"}
          </div>
        </div>
      ))}
    </div>
  );
}

// ====================================================================
// Chat View Component
// ====================================================================
function ChatView({ spaceId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!spaceId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "messages", spaceId, "chats"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages(data);
      },
      (err) => console.error("메시지 구독 오류:", err)
    );

    return () => unsubscribe();
  }, [spaceId]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || !spaceId) return;

      const messageData = {
        sender: "admin",
        text: input,
        createdAt: serverTimestamp(), // Corrected
      };
      console.log("AdminApp: Sending message data to Firestore:", messageData);

      try {
        await addDoc(collection(db, "messages", spaceId, "chats"), messageData);
        console.log("AdminApp: 메시지가 성공적으로 전송되었습니다.");
      } catch (error) {
        console.error("AdminApp: 메시지 전송 실패 (addDoc):", error);
        return;
      }

      const activeChatUpdateData = {
        lastMessage: input,
        timestamp: serverTimestamp(), // Corrected
      };
      console.log(
        "AdminApp: Updating active_chats with data:",
        activeChatUpdateData
      );

      try {
        await setDoc(doc(db, "active_chats", spaceId), activeChatUpdateData, {
          merge: true,
        });
        console.log("AdminApp: 채팅방의 마지막 메시지가 업데이트되었습니다.");
      } catch (error) {
        console.error("AdminApp: 마지막 메시지 업데이트 실패 (setDoc):", error);
      }

      setInput("");
    },
    [input, spaceId]
  );

  if (!spaceId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#888",
          textAlign: "center",
        }}
      >
        <p>왼쪽 목록에서 채팅 공간을 선택하세요.</p>
        <p style={{ fontSize: "0.9em", color: "#aaa" }}>
          활성 채팅 공간이 없으면, 클라이언트(예: 웹사이트)에서 먼저 채팅을
          시작해야 합니다.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #ddd",
          background: "white",
        }}
      >
        <strong>{spaceId.substring(5, 12)}... 고객과의 채팅 공간</strong>
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: "15px" }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: "10px",
              textAlign: m.sender === "admin" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "15px",
                background: m.sender === "admin" ? "#1e88e5" : "#f1f1f1",
                color: m.sender === "admin" ? "white" : "black",
                maxWidth: "70%",
                wordBreak: "break-word",
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
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="관리자 메시지 입력"
        />
        <button
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            background: "#1e88e5",
            color: "white",
            border: "none",
            borderRadius: "5px",
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
function AdminApp() {
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    console.log(
      "AdminApp: Setting up Firestore listener for 'active_chats'..."
    );
    const q = query(
      collection(db, "active_chats"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        console.log(
          "AdminApp: Received snapshot for 'active_chats'. Snapshot empty:",
          snap.empty
        );
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("AdminApp: Processed active spaces list:", list);
        setSpaces(list);

        // 첫 공간 자동 선택
        if (!selectedSpaceId && list.length > 0) {
          setSelectedSpaceId(list[0].id);
        }
      },
      (err) => console.error("AdminApp: 'active_chats' 구독 실패:", err)
    );

    return () => {
      console.log(
        "AdminApp: Cleaning up Firestore listener for 'active_chats'."
      );
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList
        onSelectSpace={setSelectedSpaceId}
        selectedSpaceId={selectedSpaceId}
        spaces={spaces}
      />

      <ChatView spaceId={selectedSpaceId} />
    </div>
  );
}

// ======================
// React 렌더링
// ======================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
