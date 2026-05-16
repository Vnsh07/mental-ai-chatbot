export function AuthInput({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  error,
  disabled,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-zinc-950/55 px-4 py-3 text-sm text-white outline-none transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 ${
          error
            ? "border-red-500/50"
            : "border-zinc-800/90 focus:border-zinc-600"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-400/90">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AuthButton({ children, loading, type = "submit", disabled }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="mt-6 flex w-full items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-100 py-3 text-sm font-semibold text-black shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_12px_28px_-10px_rgba(0,0,0,0.85)] transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-40"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
