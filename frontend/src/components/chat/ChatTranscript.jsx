import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export function ChatTranscript({
  chat,
  loading,
  scrollAreaRef,
  bottomSentinelRef,
}) {
  return (
    <div
      ref={scrollAreaRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-4 sm:px-5 sm:pb-[calc(8rem+env(safe-area-inset-bottom,0px))] sm:pt-6 md:px-8"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5 sm:gap-6">
        {chat.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-1 rounded-3xl border border-zinc-800/85 bg-zinc-950/50 p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8"
          >
            <p className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Welcome back
            </p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              Ask anything—or share how you&apos;re feeling. Replies come from
              your local Mental AI endpoint. Conversations and check-ins stay on
              this device.
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {chat.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-start"
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={bottomSentinelRef}
          className="h-px w-full shrink-0 scroll-mt-4"
          aria-hidden
        />
      </div>
    </div>
  );
}
