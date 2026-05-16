import { Activity, LogOut, MessageSquare, Sparkles, Trash2 } from "lucide-react";

export function MobileHeader({
  activeView,
  onViewChange,
  currentMoodEmoji,
  onClearChat,
  clearDisabled,
  userEmail,
  onLogout,
}) {
  return (
    <header className="relative z-10 flex flex-col gap-3 border-b border-zinc-800/80 bg-zinc-950/40 px-3 py-3 backdrop-blur-2xl md:hidden sm:px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800/90 bg-zinc-900/50 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-8px_rgba(0,0,0,0.85)]">
          <Sparkles className="h-5 w-5 text-zinc-300" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold tracking-tight text-white">
            Mental AI
          </p>
          <p className="text-[11px] font-medium text-zinc-500">
            {userEmail ? (
              <span className="truncate">{userEmail}</span>
            ) : currentMoodEmoji ? (
              `${currentMoodEmoji} Latest mood logged`
            ) : (
              "Private companion workspace"
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800/90 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
          </button>
          {activeView === "chat" ? (
          <button
            type="button"
            onClick={onClearChat}
            disabled={clearDisabled}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800/90 bg-zinc-900/50 px-2.5 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Clear</span>
          </button>
          ) : (
            <span className="w-0" aria-hidden />
          )}
        </div>
      </div>

      <div
        className="flex rounded-xl border border-zinc-800/90 bg-zinc-950/55 p-1"
        role="tablist"
        aria-label="Workspace section"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "chat"}
          onClick={() => onViewChange("chat")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            activeView === "chat"
              ? "bg-zinc-800/90 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Chat
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "mood"}
          onClick={() => onViewChange("mood")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
            activeView === "mood"
              ? "bg-zinc-800/90 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Activity className="h-3.5 w-3.5" aria-hidden />
          Mood
        </button>
      </div>
    </header>
  );
}
