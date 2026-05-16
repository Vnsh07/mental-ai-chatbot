import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";

export function ChatComposer({
  message,
  onMessageChange,
  onSend,
  onKeyDown,
  loading,
}) {
  return (
    <div className="relative z-30 border-t border-zinc-800/80 bg-zinc-950/45 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-2xl sm:px-5 sm:pt-4 md:px-8">
      <div className="mx-auto flex max-w-3xl gap-2 sm:gap-3">
        <motion.div
          className="flex min-w-0 flex-1 items-center rounded-2xl border border-zinc-800/90 bg-zinc-950/55 px-3 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_12px_32px_-20px_rgba(0,0,0,0.55)] sm:px-4"
          whileFocusWithin={{
            borderColor: "rgba(161, 161, 170, 0.35)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 1px 0 0 rgba(255,255,255,0.04) inset",
          }}
          transition={{ duration: 0.18 }}
        >
          <input
            type="text"
            placeholder={loading ? "Waiting for reply…" : "Message Mental AI…"}
            className="min-h-[48px] w-full bg-transparent py-3 text-sm text-white placeholder:text-zinc-600 outline-none sm:min-h-[52px] sm:text-[0.9375rem]"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            aria-label="Message input"
            aria-busy={loading}
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={onSend}
          disabled={loading || !message.trim()}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="group relative flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-800 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_10px_28px_-8px_rgba(0,0,0,0.85)] transition-[box-shadow,opacity] hover:border-zinc-600/70 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_14px_32px_-10px_rgba(0,0,0,0.9)] disabled:pointer-events-none disabled:opacity-35 sm:h-[52px] sm:w-[52px]"
          aria-label={loading ? "Sending message" : "Send message"}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
            }}
          />
          {loading ? (
            <Loader2
              className="relative h-[18px] w-[18px] shrink-0 animate-spin text-zinc-100 sm:h-5 sm:w-5"
              aria-hidden
            />
          ) : (
            <Send className="relative h-[18px] w-[18px] translate-x-px text-zinc-100 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
          )}
        </motion.button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] font-medium text-zinc-500">
        {loading
          ? "Mental AI is composing a reply…"
          : "AI can make mistakes. Not a substitute for professional care."}
      </p>
    </div>
  );
}
