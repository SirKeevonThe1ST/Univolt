import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import type { DemoRole } from "@/lib/demo/types";

export function ConfirmAction({
  label,
  description,
  confirmLabel = "Confirm",
  danger,
  disabled,
  requiredRole,
  role,
  onConfirm,
}: {
  label: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  disabled?: boolean;
  requiredRole?: DemoRole;
  role: DemoRole;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  const blocked = requiredRole && role !== requiredRole && role !== "supervisor";

  return (
    <>
      <Button
        size="sm"
        variant={danger ? "danger" : "outline"}
        disabled={disabled || blocked}
        onClick={() => setOpen(true)}
        title={blocked ? `Requires ${requiredRole}` : undefined}
      >
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Human confirmation required">
          <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
          <p className="mt-3 text-xs text-muted">
            The model cannot take this step. It does not contact authorities or expose identity on its own.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={danger ? "danger" : "default"}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
