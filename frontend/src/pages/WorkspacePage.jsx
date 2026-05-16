import { useCallback, useEffect, useState } from "react";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatTranscript } from "../components/chat/ChatTranscript";
import { Background } from "../components/layout/Background";
import { MobileHeader } from "../components/layout/MobileHeader";
import { MoodHistory } from "../components/mood/MoodHistory";
import { MoodSelector } from "../components/mood/MoodSelector";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getMoodMeta } from "../constants/moods";
import { useChatScroll } from "../hooks/useChatScroll";
import { useMoodLog } from "../hooks/useMoodLog";
import { usePersistentChat } from "../hooks/usePersistentChat";
import { api } from "../lib/api";

export function WorkspacePage() {
  const { user, logout } = useAuth();
  const userId = user?.id ?? "";

  const [activeView, setActiveView] = useState("chat");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { chat, setChat, clearChat } = usePersistentChat(userId);
  const moodLog = useMoodLog(userId);
  const { scrollAreaRef, bottomSentinelRef, scrollToLatest } = useChatScroll(
    chat,
    loading,
  );

  const currentMoodMeta = moodLog.currentMoodId
    ? getMoodMeta(moodLog.currentMoodId)
    : null;

  useEffect(() => {
    if (activeView !== "chat") return;
    const id = requestAnimationFrame(() => {
      const el = scrollAreaRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [activeView, scrollAreaRef]);

  const handleClearChat = useCallback(() => {
    if (loading) return;
    clearChat();
    requestAnimationFrame(() => {
      scrollToLatest("smooth");
    });
  }, [loading, clearChat, scrollToLatest]);

  const sendMessage = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const now = new Date().toISOString();
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      createdAt: now,
    };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/v1/chat", {
        message: trimmed,
      });

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        text: response.data.reply,
        createdAt: new Date().toISOString(),
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
      setChat((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Something went wrong reaching the assistant. Try again in a moment.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [message, loading, setChat]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearDisabled = loading || chat.length === 0;

  if (!userId) {
    return null;
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black text-white md:flex-row">
      <Background />

      <MobileHeader
        activeView={activeView}
        onViewChange={setActiveView}
        currentMoodEmoji={currentMoodMeta?.emoji}
        onClearChat={handleClearChat}
        clearDisabled={clearDisabled}
        userEmail={user.email}
        onLogout={logout}
      />

      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        currentMoodId={moodLog.currentMoodId}
        onClearChat={handleClearChat}
        clearDisabled={clearDisabled}
        user={user}
        onLogout={logout}
      />

      <main
        className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col"
        aria-busy={loading && activeView === "chat"}
      >
        {activeView === "chat" ? (
          <>
            <ChatTranscript
              chat={chat}
              loading={loading}
              scrollAreaRef={scrollAreaRef}
              bottomSentinelRef={bottomSentinelRef}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-black via-black/90 to-transparent" />
            <ChatComposer
              message={message}
              onMessageChange={setMessage}
              onSend={sendMessage}
              onKeyDown={onKeyDown}
              loading={loading}
            />
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6 md:px-10">
            <div className="mx-auto max-w-3xl">
              <MoodSelector onSelect={moodLog.logMood} />
              <MoodHistory entries={moodLog.entries} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
