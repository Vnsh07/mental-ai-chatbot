import { motion } from "framer-motion";
import { formatMessageTimestamp } from "../../utils/formatTime";

export function ChatMessage({ message: msg }) {
  const ts = formatMessageTimestamp(msg.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1],
        layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      }}
      className={`flex w-full scroll-mt-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[min(100%,28rem)] ${
          msg.role === "user"
            ? "rounded-[1.35rem] rounded-br-md border border-zinc-700/55 bg-zinc-900/85 px-[1.125rem] py-3.5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_16px_40px_-16px_rgba(0,0,0,0.65)] sm:px-5 sm:py-[1.125rem]"
            : "rounded-[1.35rem] rounded-bl-md border border-zinc-800/90 bg-zinc-950/55 px-[1.125rem] py-3.5 shadow-[0_20px_44px_-28px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-5 sm:py-[1.125rem]"
        }`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p
            className={`text-[11px] font-semibold uppercase tracking-wider ${msg.role === "user" ? "text-zinc-400" : "text-zinc-500"}`}
          >
            {msg.role === "user" ? "You" : "Mental AI"}
          </p>
          {ts ? (
            <time
              dateTime={msg.createdAt}
              className="text-[10px] font-medium tabular-nums text-zinc-600"
            >
              {ts}
            </time>
          ) : null}
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-[1.6] text-zinc-100 sm:text-[0.9375rem]">
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}
