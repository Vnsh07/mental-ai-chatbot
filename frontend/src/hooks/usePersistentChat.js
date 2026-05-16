import { useCallback, useEffect, useState } from "react";
import { chatStorageKey } from "../constants/authStorage";

const LEGACY_CHAT_KEY = "mental-ai-chat-v1";

function normalizeRow(m, i) {
  if (
    !m ||
    typeof m.text !== "string" ||
    (m.role !== "user" && m.role !== "ai")
  ) {
    return null;
  }
  const createdAt =
    typeof m.createdAt === "string" ? m.createdAt : undefined;
  return {
    id: typeof m.id === "string" ? m.id : `legacy-${i}`,
    role: m.role,
    text: m.text,
    ...(createdAt ? { createdAt } : {}),
  };
}

export function loadChatMessages(storageKey) {
  try {
    let raw = localStorage.getItem(storageKey);
    if (!raw && storageKey.includes("mental-ai-chat-v2-")) {
      raw = localStorage.getItem(LEGACY_CHAT_KEY);
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRow).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * @param {string} userId
 */
export function usePersistentChat(userId) {
  const key = chatStorageKey(userId);
  const [chat, setChat] = useState(() => loadChatMessages(key));

  useEffect(() => {
    setChat(loadChatMessages(key));
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(chat));
    } catch (e) {
      console.warn("Could not save chat history", e);
    }
  }, [chat, key]);

  const clearChat = useCallback(() => {
    setChat([]);
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(LEGACY_CHAT_KEY);
    } catch (e) {
      console.warn("Could not clear stored chat", e);
    }
  }, [key]);

  return { chat, setChat, clearChat };
}
