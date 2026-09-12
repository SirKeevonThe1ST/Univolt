import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("text-teal", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="currentColor" />
      <path
        d="M24 10c6 4 10 5 12 5v11c0 8-5.2 13.4-12 16-6.8-2.6-12-8-12-16V15c2 0 6-1 12-5z"
        fill="#F3EEE4"
      />
      <path
        d="M24 16c4 2.4 7 3 8.5 3v7.2c0 5.2-3.4 8.7-8.5 10.6-5.1-1.9-8.5-5.4-8.5-10.6V19c1.5 0 4.5-.6 8.5-3z"
        fill="none"
        stroke="#0A524E"
        strokeWidth="1.6"
      />
      <circle cx="24" cy="25" r="2.2" fill="#0A524E" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-ink", className)}>
      <Mark className="size-8" />
      <span className="font-display text-lg font-medium tracking-tight">SurakshaNet</span>
    </span>
  );
}
