import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useChatScroll(chat, loading) {
  const scrollAreaRef = useRef(null);
  const bottomSentinelRef = useRef(null);

  const scrollToLatest = useCallback((behavior) => {
    const root = scrollAreaRef.current;
    const target = bottomSentinelRef.current;
    if (root && target) {
      target.scrollIntoView({ behavior, block: "end" });
      return;
    }
    if (root) {
      root.scrollTo({ top: root.scrollHeight, behavior });
    }
  }, []);

  const skipNextSmoothScrollRef = useRef(true);

  useLayoutEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;
    root.scrollTo({ top: root.scrollHeight, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (skipNextSmoothScrollRef.current) {
      skipNextSmoothScrollRef.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      scrollToLatest("smooth");
    });
    return () => cancelAnimationFrame(id);
  }, [chat, loading, scrollToLatest]);

  return { scrollAreaRef, bottomSentinelRef, scrollToLatest };
}
