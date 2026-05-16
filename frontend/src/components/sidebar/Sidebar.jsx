import { motion } from "framer-motion";
import {
  Activity,
  LogOut,
  MessageSquare,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getMoodMeta } from "../../constants/moods";

const views = [
  { id: "chat", label: "Assistant", icon: MessageSquare },
  { id: "mood", label: "Mood", icon: Activity },
];

export function Sidebar({
  activeView,
  onViewChange,
  currentMoodId,
  onClearChat,
  clearDisabled,
  user,
  onLogout,
}) {
  const moodMeta = currentMoodId ? getMoodMeta(currentMoodId) : null;

  return (
    <aside className="relative z-10 hidden w-[min(19rem,30vw)] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/35 p-6 backdrop-blur-2xl md:flex">
      <div className="mb-8 flex items-center gap-3">
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_32px_-12px_rgba(0,0,0,0.9)]"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sparkles className="h-6 w-6 text-zinc-300" aria-hidden />
        </motion.div>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold tracking-tight text-white">
            Mental AI
          </h1>
          <p className="text-xs font-medium text-zinc-500">Private · On-device</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Current mood
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl leading-none" aria-hidden>
            {moodMeta?.emoji ?? "—"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200">
              {moodMeta ? moodMeta.label : "Not logged yet"}
            </p>
            <p className="text-[11px] text-zinc-500">
              {moodMeta ? "Latest check-in" : "Tap Mood to log"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5" aria-label="Primary">
        {views.map((v, i) => {
          const Icon = v.icon;
          const active = activeView === v.id;
          return (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => onViewChange(v.id)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active
                  ? "border-zinc-700/80 bg-zinc-900/55 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]"
                  : "border-transparent text-zinc-400 hover:border-zinc-800/90 hover:bg-zinc-900/25 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {v.label}
            </motion.button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onClearChat}
        disabled={clearDisabled}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800/90 bg-transparent py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900/30 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-30"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        Clear conversation
      </button>

      <div className="mt-6 rounded-2xl border border-zinc-800/90 bg-zinc-900/25 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Account
        </p>
        <p className="mt-2 truncate text-sm font-medium text-zinc-200">
          {user?.full_name?.trim() || user?.email}
        </p>
        {user?.full_name?.trim() ? (
          <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800/90 bg-zinc-950/40 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          Sign out
        </button>
      </div>

      <p className="mt-6 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
        Product
      </p>
      <p className="mt-1 px-1 text-xs leading-relaxed text-zinc-500">
        Secure workspace for reflection. Data stays local unless you connect
        your own backend.
      </p>

      <div className="mt-auto border-t border-zinc-800/80 pt-6">
        <p className="text-[11px] text-zinc-600">Mental AI Suite</p>
        <p className="text-xs text-zinc-500">Authenticated session</p>
      </div>
    </aside>
  );
}
