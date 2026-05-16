import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Background } from "../layout/Background";

export function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <Background />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          className="mb-8 flex flex-col items-center text-center sm:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_32px_-12px_rgba(0,0,0,0.9)]">
            <Sparkles className="h-8 w-8 text-zinc-300" aria-hidden />
          </div>
          <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-md text-sm text-zinc-500">{subtitle}</p>
          ) : null}
        </motion.div>

        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-3xl border border-zinc-800/85 bg-zinc-950/55 p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
          {footer ? (
            <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
          ) : null}
        </motion.div>

        <p className="relative z-10 mt-10 max-w-md text-center text-[11px] leading-relaxed text-zinc-600">
          If you are in crisis, contact local emergency services or a crisis
          hotline. Mental AI does not replace professional care.
        </p>
      </div>
    </div>
  );
}
