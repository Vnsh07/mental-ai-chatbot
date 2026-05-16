import { motion, AnimatePresence } from "framer-motion";
import { getMoodMeta } from "../../constants/moods";
import { formatMoodLogTime } from "../../utils/formatTime";

export function MoodHistory({ entries }) {
  if (entries.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-dashed border-zinc-800/90 bg-zinc-950/30 px-6 py-14 text-center backdrop-blur-xl">
        <p className="text-sm font-medium text-zinc-500">
          No check-ins yet. Log your first mood above.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="font-display text-sm font-semibold tracking-tight text-white">
        Recent check-ins
      </h3>
      <p className="mt-0.5 text-xs text-zinc-500">
        Newest first · kept on-device
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const meta = getMoodMeta(entry.mood);
            return (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="list-none"
              >
                <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/85 bg-zinc-950/55 p-4 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800/90 bg-zinc-900/50 text-xl">
                    {meta?.emoji ?? "·"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-100">
                      {meta?.label ?? "Mood"}
                    </p>
                    <time
                      dateTime={entry.at}
                      className="mt-0.5 block text-xs text-zinc-500"
                    >
                      {formatMoodLogTime(entry.at)}
                    </time>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}
