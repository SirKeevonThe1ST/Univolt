import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "./ui/button";
import { isAllowedImage, resizeImageFile } from "@/lib/ai/media-client";
import { cn } from "@/lib/utils";

export type Shot = { id: string; name: string; dataUrl: string };

export function ScreenshotUploader({
  shots,
  onChange,
  compact,
}: {
  shots: Shot[];
  onChange: (next: Shot[]) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function addFiles(files: FileList | File[]) {
    setError(null);
    const list = [...files];
    if (!list.length) return;
    setBusy(true);
    const next = [...shots];
    try {
      for (const file of list) {
        const err = isAllowedImage(file);
        if (err) {
          setError(err);
          continue;
        }
        const resized = await resizeImageFile(file);
        next.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: resized.name,
          dataUrl: resized.dataUrl,
        });
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not attach that image.");
    } finally {
      setBusy(false);
    }
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) void addFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files?.length) void addFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        className="sr-only"
        onChange={onInput}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          drag ? "border-teal bg-teal-mist/70" : "border-border bg-paper hover:border-teal/50",
          compact && "py-5",
        )}
      >
        <ImagePlus className="size-6 text-teal" />
        <p className="mt-2 text-sm font-medium">+ Add conversation evidence</p>
        <p className="mt-1 text-xs text-muted">Drag screenshots here or click to browse</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted">PNG · JPG · WEBP</p>
      </button>
      {busy && <p className="text-xs text-muted">Preparing images…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
      {shots.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Attached evidence</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {shots.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2">
                <img src={s.dataUrl} alt="" className="size-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">Screenshot {i + 1}</p>
                  <p className="truncate text-[11px] text-muted">{s.name}</p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Remove screenshot"
                  onClick={() => onChange(shots.filter((x) => x.id !== s.id))}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
          <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => inputRef.current?.click()}>
            + Add another screenshot
          </Button>
        </div>
      )}
    </div>
  );
}
