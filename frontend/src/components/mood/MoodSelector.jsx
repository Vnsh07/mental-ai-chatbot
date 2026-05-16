import { motion } from "framer-motion";
import { MOOD_OPTIONS } from "../../constants/moods";

export function MoodSelector({ onSelect, disabled }) {
  return (
    <section className="rounded-3xl border border-zinc-800/85 bg-zinc-950/50 p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
      <h2 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
        How are you feeling?
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Log a moment in one tap. Entries stay private on this device.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {MOOD_OPTIONS.map((m, i) => (
          <motion.button
            key={m.id}
            type="button"
            disabled={disabled}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.04 * i,
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => onSelect(m.id)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-800/90 bg-zinc-900/40 px-3 py-4 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] transition-colors hover:border-zinc-700 hover:bg-zinc-900/65 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="text-2xl leading-none sm:text-[1.75rem]" aria-hidden>
              {m.emoji}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {m.label}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
