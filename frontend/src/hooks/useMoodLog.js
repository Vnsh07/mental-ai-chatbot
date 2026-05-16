import { useCallback, useEffect, useState } from "react";
import { moodsStorageKey } from "../constants/authStorage";

const MAX_ENTRIES = 120;

function normalizeEntry(e, i) {
  if (!e || typeof e.mood !== "string" || typeof e.at !== "string") {
    return null;
  }
  return {
    id: typeof e.id === "string" ? e.id : `mood-legacy-${i}`,
    mood: e.mood,
    at: e.at,
  };
}

function loadMoodEntries(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * @param {string} userId
 */
export function useMoodLog(userId) {
  const key = moodsStorageKey(userId);
  const [entries, setEntries] = useState(() => loadMoodEntries(key));

  useEffect(() => {
    setEntries(loadMoodEntries(key));
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(entries));
    } catch (e) {
      console.warn("Could not save mood history", e);
    }
  }, [entries, key]);

  const logMood = useCallback((moodId) => {
    const entry = {
      id: crypto.randomUUID(),
      mood: moodId,
      at: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const current = entries[0] ?? null;

  return { entries, logMood, currentMoodId: current?.mood ?? null };
}
