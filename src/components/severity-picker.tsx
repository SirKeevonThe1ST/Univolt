import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";

const FACES = [
  {
    value: 1,
    key: "sev1",
    svg: (
      <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
        <circle cx="24" cy="24" r="20" fill="#D5E8E6" />
        <circle cx="17" cy="21" r="2" fill="#1A2422" />
        <circle cx="31" cy="21" r="2" fill="#1A2422" />
        <path d="M16 30c2.5 3 13.5 3 16 0" fill="none" stroke="#1A2422" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 2,
    key: "sev2",
    svg: (
      <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
        <circle cx="24" cy="24" r="20" fill="#E7E0D3" />
        <circle cx="17" cy="21" r="2" fill="#1A2422" />
        <circle cx="31" cy="21" r="2" fill="#1A2422" />
        <path d="M17 31h14" fill="none" stroke="#1A2422" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 3,
    key: "sev3",
    svg: (
      <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
        <circle cx="24" cy="24" r="20" fill="#F3E6C8" />
        <circle cx="17" cy="21" r="2" fill="#1A2422" />
        <circle cx="31" cy="21" r="2" fill="#1A2422" />
        <path d="M18 33c3-3 9-3 12 0" fill="none" stroke="#1A2422" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 4,
    key: "sev4",
    svg: (
      <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
        <circle cx="24" cy="24" r="20" fill="#F0D9D6" />
        <circle cx="17" cy="21" r="2" fill="#1A2422" />
        <circle cx="31" cy="21" r="2" fill="#1A2422" />
        <path d="M17 34c4-5 10-5 14 0" fill="none" stroke="#1A2422" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function SeverityPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FACES.map((f) => {
        const selected = value === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={cn(
              "flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors",
              selected
                ? "border-teal bg-teal-mist ring-2 ring-teal/30"
                : "border-border bg-surface hover:bg-paper-2",
            )}
            aria-pressed={selected}
          >
            {f.svg}
            <span className="text-sm font-medium text-ink">{t(f.key)}</span>
          </button>
        );
      })}
    </div>
  );
}
