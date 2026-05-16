import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div
      className="flex max-w-[min(100%,20rem)] items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/55 px-4 py-3 backdrop-blur-xl"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="flex h-5 items-end justify-center gap-1" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-zinc-500"
            style={{ height: 18, transformOrigin: "50% 100%" }}
            animate={{
              scaleY: [0.35, 1, 0.45, 0.85, 0.35],
              opacity: [0.35, 1, 0.55, 0.9, 0.35],
            }}
            transition={{
              duration: 1.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium tracking-wide text-zinc-500">
        Mental AI is typing
      </span>
    </div>
  );
}
