export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden
      >
        <circle cx="6" cy="14" r="3.5" fill="#e85d75" />
        <circle cx="14" cy="14" r="4" fill="#f7c6b8" />
        <circle cx="22" cy="14" r="3.5" fill="#1a2b3c" />
      </svg>
      <span>
        axloxo<span className="text-brand">.</span>
      </span>
    </span>
  );
}
