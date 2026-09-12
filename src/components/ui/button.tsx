import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-teal text-surface hover:bg-teal-deep",
        invert: "bg-ink text-paper hover:bg-ink-soft",
        outline:
          "border border-border bg-transparent text-ink hover:bg-paper-2",
        ghost: "text-ink-soft hover:bg-paper-2 hover:text-ink",
        danger: "bg-danger text-surface hover:bg-danger/90",
        exit: "bg-ink text-paper hover:bg-ink-soft font-semibold",
      },
      size: {
        sm: "h-9 rounded-[10px] px-3 text-sm",
        md: "h-11 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-2xl px-5 text-base",
        xl: "h-14 rounded-2xl px-6 text-base",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
